const fs = require('fs');
const models = require('./models.js');
const prompts = require('./prompts.js');

const writer = {};

writer.write = async (subject, background, research="xAI Grok 2") => {
  try {
    const titlePrompt = structuredClone(prompts.titles);
    titlePrompt[1].content = titlePrompt[1].content.replace('$subject', subject).replace('$background', background);
    const titles = await models.deepseek(titlePrompt);
    const authorPrompt = structuredClone(prompts.author);
    authorPrompt[1].content = authorPrompt[1].content
      .replace('$subject', subject)
      .replace('$background', background)
      .replace('$titles', titles)
      .replace('$author', 'OpenAI ChatGPT 4o')
      .replace('$research', research)
      .replace('$illustrator', "OpenAI Dall-E 3")
    let htmlContent = await models.chatGPT(authorPrompt);
    htmlContent = htmlContent
      .replaceAll(`—`,`-`)
      .replaceAll(`–`,`-`)
      .replaceAll(`’`,`'`) 
      .replaceAll(`“`,`"`)
      .replaceAll(`”`,`"`)
      .replaceAll(`…`,`...`)
      .replaceAll('```html','')
      .replaceAll('```','')
      .replace(/[^\x09\x0A\x0D\x20-\x7E\xA3\u20AC]/g, '');
    const regex = /(title|slug|description|image|category):\s*"([^"]+)"/g;
    const article = {};
    let match;
    while ((match = regex.exec(htmlContent)) !== null) article[match[1]] = match[2];
    const { title, slug, description, image, category } = article;
    console.log({ title, slug, description, image, category });
    if (!title) return;
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const outputDir = `content/${year}/${month}/`;
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    const outputFile = `${outputDir}${slug}.html`;
    fs.writeFileSync(outputFile, htmlContent, 'utf8');
    console.log(`Article generated and saved to ${outputFile}`);

    const indexPath = './content/index.json';
    let indexData = [];
    try {
      const data = fs.readFileSync(indexPath, 'utf8');
      indexData = JSON.parse(data);
    } catch (err) {
      console.error('Error reading index.json, starting with a new file.', err);
    }
    const articleMetadata = {
      title,
      slug,
      description,
      image,
      category,
      path: `${year}/${month}/`,
      featured: false,
      date: new Date().toISOString()
    }
    if (!indexData.some(item => item.slug === slug)) {
      indexData.unshift(articleMetadata);
    }
    fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2), 'utf8');
    console.log(`Index updated at ${indexPath}`);
    return articleMetadata;
  } catch (error) {
    console.error('Error writer.js 63:', error.response ? error.response.data : error.message);
  }
}

module.exports = writer;
