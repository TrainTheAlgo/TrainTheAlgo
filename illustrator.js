const fs = require('fs');
const path = require('path');
const axios = require('axios');
const models = require('./models.js');
const prompts = require('./prompts.js');

const illustrator = {};

illustrator.illustrate = async (article, fileLocation) => {
  try {
    //const articleText = article.replace(/<[^>]*>/g, '');
    const designerPrompt = [ ...prompts.illustrate ];
    designerPrompt[1].content = designerPrompt[1].content.replace('$article', article);
    const imagePrompt = await models.deepseek(designerPrompt);
    console.log(imagePrompt)
    const imageResponse = await models.dallE(imagePrompt);
    //console.log('xAI API responded with:', imageResponse);
    if (imageResponse && imageResponse.data[0].url) {
      const imageUrl = imageResponse.data[0].url;
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
    } else {
      console.log('No image URL found in the API response.');
    }
  } catch (err) {
    console.error('Error in illustrator.illustrate:', err);
  }
};

module.exports = illustrator;
