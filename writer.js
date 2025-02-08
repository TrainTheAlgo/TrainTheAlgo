const axios = require('axios');
const fs = require('fs');
const models = require('models');
const prompts = require('prompts');

const write = async (subject, background) => {
  try {
    const titlePrompt = prompts.titles.replace('$subject', subject).replace('$background', background);
    const titles = await chatGPT(titlePrompt);
    const authorPrompt = prompts.author.titles.replace('$subject', subject).replace('$background', background).replace('$titles', titles);
    const htmlContent = await chatGPT(authorPrompt);
    const regex = /(title|slug|description|image):\s*"([^"]+)"/g;
    const article = {};
    let match;
    while ((match = regex.exec(htmlContent)) !== null) article[match[1]] = match[2];
    const { title, slug, description, image } = article;
    console.log({ title, slug, description, image });

    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const outputDir = `content/${year}/${month}/`;
    await fs.mkdir(outputDir, { recursive: true });
    const outputFile = `${outputDir}${slug}.html`;
    await fs.writeFile(outputFile, htmlContent, 'utf8');
    console.log(`Article generated and saved to ${outputFile}`);

    const indexPath = 'content/index.json';
    let indexData = [];
    try {
      const data = await fs.readFile(indexPath, 'utf8');
      indexData = JSON.parse(data);
    } catch (err) {
      console.error('Error reading index.json, starting with a new file.', err);
    }

    indexData.push({
      title,
      slug,
      description,
      image,
      path: `${year}/${month}/`,
      date: new Date().toISOString()
    });

    await fs.writeFile(indexPath, JSON.stringify(indexData, null, 2), 'utf8');
    console.log(`Index updated at ${indexPath}`);

  } catch (error) {
    console.error('Error calling the OpenAI API:', error.response ? error.response.data : error.message);
  }
}

module.exports = { write };
