const fs = require('fs');
const models = require('./models.js');
const prompts = require('./prompts.js');

const indexPath = './content/index.json';

const news = {};

news.find = async () => {
  if (!fs.existsSync(indexPath)) fs.writeFileSync(indexPath, '[]', 'utf8');
  const data = fs.readFileSync(indexPath, 'utf8');
  const covered = JSON.parse(data).slice(0, 10).map(a => a.title).join("\v");
  let newsPrompt = structuredClone(prompts.newsFinder);
  newsPrompt = newsPrompt.replace('$covered', covered);

  const prompt = [
    {
      role: 'system',
      content: 'You are a helpful assistant. If you do not have real-time access to current news, say so explicitly in the article.'
    },
    { role: 'user', content: newsPrompt }
  ];
  const storyResult = await models.xAI(prompt);
  return { title: storyResult.split("\n")[0], background: storyResult };
}

/*
const test = async () => {
  const res = await news.find();
  console.log(res);
}
test();
*/

module.exports = news;
