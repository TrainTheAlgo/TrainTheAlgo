const fs = require('fs');
const path = require('path');
const axios = require('axios');
const models = require('./models.js');
const prompts = require('./prompts.js');

const illustrator = {};

illustrator.illustrate = async (article, fileLocation) => {
  try {
    //const articleText = article.replace(/<[^>]*>/g, '');
    const designerPrompt = structuredClone(prompts.illustrate);
    designerPrompt[1].content = designerPrompt[1].content.replace('$article', article);
    const imagePrompt = await models.local(designerPrompt);
    console.log(imagePrompt)
    const imageResponse = await models.imageGen(imagePrompt);
    //console.log('xAI API responded with:', imageResponse);
    const firstImage = imageResponse && imageResponse.data && imageResponse.data[0];
    if (firstImage && firstImage.url) {
      const imageUrl = firstImage.url;
      //console.log('Image generated at:', imageUrl);
      const response = await axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'stream'
      });
      const writer = fs.createWriteStream(fileLocation);
      response.data.pipe(writer);
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
      console.log(`Image saved to ${fileLocation}`);
      return;
    }
    if (firstImage && firstImage.b64_json) {
      const buffer = Buffer.from(firstImage.b64_json, 'base64');
      fs.writeFileSync(fileLocation, buffer);
      console.log(`Image saved to ${fileLocation}`);
      return;
    }
    console.log('No image URL or base64 image found in the API response.');
  } catch (err) {
    console.error('Error in illustrator.illustrate:', err);
  }
};

module.exports = illustrator;
