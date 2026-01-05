const fs = require('fs');
const path = require('path');
const models = require('./models.js');
const prompts = require('./prompts.js');

const writer = {};

writer.write = async (subject, background, researchModel="xAI Grok") => {
  try {
    const titlePrompt = structuredClone(prompts.titles);
    titlePrompt[1].content = titlePrompt[1].content.replace('$subject', subject).replace('$background', background);
    const titles = await models.local(titlePrompt);
    const authorPrompt = structuredClone(prompts.author);
    authorPrompt[0].content = authorPrompt[0].content
      .replace('$author', 'OpenAI ChatGPT')
      .replace('$research', researchModel)
      .replace('$illustrator', "OpenAI ImageGen");
      authorPrompt[1].content = authorPrompt[1].content
      .replace('$subject', subject)
      .replace('$background', background)
      .replace('$titles', titles);
      console.log(authorPrompt)
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
    const regex = /(title|slug|description|image|category|research|author|illustrator):\s*"([^"]+)"/g;
    const article = {};
    let match;
    while ((match = regex.exec(htmlContent)) !== null) article[match[1]] = match[2];
    const { title, slug, description, image, category, research, author, illustrator } = article;
    console.log({ title, slug, description, image, category, research, author, illustrator });
    if (!title) return;
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const contentRoot = path.join(__dirname, 'content');
    const outputDir = path.join(contentRoot, year, month);
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    const outputFile = path.join(outputDir, `${slug}.html`);
    fs.writeFileSync(outputFile, htmlContent, 'utf8');
    console.log(`Article generated and saved to ${outputFile}`);

    const indexPath = path.join(contentRoot, 'index.json');
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
      date: new Date().toISOString(),
      research,
      author,
      illustrator
    }
    console.log('articleMetadata', articleMetadata)
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
