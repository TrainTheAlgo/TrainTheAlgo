const fs = require('fs');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { spawn } = require('child_process');
const build = require('./build.js');
const deploy = require('./deploy.js');
const news = require('./news.js');
const writer = require('./writer.js');
const illustrator = require('./illustrator.js');
const models = require('./models.js');
const questions = require('./questions.js');
const { setInterval } = require('timers/promises');

const coverNews = async () => {
  const story = await news.find();    
  const metadata = await writer.write(story.title, story.background);
  await illustrator.illustrate(`${metadata.title}\n${metadata.description}`, `./content/${metadata.path}${metadata.image}`);
};

const bigQuestions = async () => {
  const qa = await questions.answer();
  const metadata = await writer.write(qa.question, qa.answer);
  await illustrator.illustrate(`${metadata.title}\n${metadata.description}`, `./content/${metadata.path}${metadata.image}`);
}

const browse = async () => {
  puppeteer.use(StealthPlugin());
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled'
    ]
  });
  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"); 
  const cookiesString = fs.readFileSync('./content/cookies.json', 'utf8');
  const cookies = JSON.parse(cookiesString);
  if (cookies.length) await page.setCookie(...cookies);
  await page.goto('https://x.com', { waitUntil: 'networkidle2' });     
  await new Promise(resolve => setTimeout(resolve, 60 * 60 * 1000));     
};

const startLocalServer = async () => {
  const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const server = spawn(command, ['http-server', './docs/'], { stdio: 'inherit' });
  const cleanup = () => {
    console.log('Shutting down http-server...');
    server.kill('SIGINT');
  };
  process.on('exit', cleanup);
  process.on('SIGINT', () => {
    cleanup();
    process.exit();
  });
  process.on('SIGTERM', () => {
    cleanup();
    process.exit();
  });
};

const init = async () => {
  const command = process.argv[2];
  if (command == 'news') coverNews();
  if (command == 'questions') bigQuestions();
  if (command == 'browse') browse();
  if (command == 'dev') {
    build.buildSite();
    startLocalServer();
  }
  if (command == 'pull') deploy.pullChanges();
  if (command == 'deploy') {
    await build.buildSite();
    await deploy.update();
  }
  if (command == 'automate') {
    for (let i = 0; i < 1e6; i++) {
      deploy.pullChanges();
      try {
        const dice = Math.random();
        if (dice < 0.9) {
          await coverNews();
        } else {
          await bigQuestions();
        }
        await build.buildSite();
        await deploy.update();
        console.log(`Completed automation: ${i}`);
      } catch (err) {
        console.log(`automation error`, err)
      }
      await new Promise(resolve => setTimeout(resolve, 60 * 60 * 1000));
    }
  }
  if (command == 'ask') {
    const prompt = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: process.argv[4] }
    ]
    const response = await models[process.argv[3]](prompt);
    console.log(response)
  }
}

init();
