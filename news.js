const fs = require('fs');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
require('dotenv').config();
const models = require('./models.js');
const prompts = require('./prompts.js');

const indexPath = './content/index.json';
const cookieFilePath = './.cookies.json';
puppeteer.use(StealthPlugin());

const news = {};

const loginIfNeeded = async (page) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 5000));
    const content = await page.content();
    if (content.match("Sign in to X")) {
        console.log('Login required – performing login...');
        await new Promise(resolve => setTimeout(resolve, 30000));
        await page.goto('https://x.com/i/grok', { waitUntil: 'networkidle2' });
    }
    const cookies = await page.cookies();
    fs.writeFileSync(cookieFilePath, JSON.stringify(cookies, null, 2));
    console.log('Login successful – cookies saved.');
  } catch (err) {
    console.log('Login issue error 38.', err);
  }
}

news.find = async () => {
  let executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  if (process.platform === 'linux') executablePath = '/usr/bin/google-chrome-stable';
  const browser = await puppeteer.launch({
    headless: true,
    executablePath,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled'
    ]
  });
  const context = browser.defaultBrowserContext();
  await context.overridePermissions('https://x.com', ['clipboard-read', 'clipboard-write']);
  const page = await context.newPage();

  // Set a realistic user agent.
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36");

  // Load stored cookies if they exist.
  if (fs.existsSync(cookieFilePath)) {
    const cookiesString = fs.readFileSync(cookieFilePath, 'utf8');
    const cookies = JSON.parse(cookiesString);
    if (cookies.length) {
      await page.setCookie(...cookies);
      console.log('Loaded cookies from file.');
    }
  }

  await page.goto('https://x.com/i/grok', { waitUntil: 'networkidle2' });
  await loginIfNeeded(page);
  await new Promise(resolve => setTimeout(resolve, 5000));
  await page.click('textarea');
  await new Promise(resolve => setTimeout(resolve, 1500));
  if (!fs.existsSync(indexPath)) fs.writeFileSync(indexPath, '[]', 'utf8');
  const data = fs.readFileSync(indexPath, 'utf8');
  const covered = JSON.parse(data).slice(0, 10).map(a => a.title).join("\v");
  let newsPrompt = structuredClone(prompts.newsFinder);
  newsPrompt = newsPrompt.replace('$covered', covered);
  //await page.type('textarea', 'Hello, Puppeteer!');
  await page.keyboard.type(newsPrompt, {delay: 30});
  await new Promise(resolve => setTimeout(resolve, 1000));
  await page.keyboard.press('Enter');
  await new Promise(resolve => setTimeout(resolve, 30000));
  await page.click('button[aria-label="Copy text"]')
  await new Promise(resolve => setTimeout(resolve, 5000));
  const storyResult = await page.evaluate(() => {
    console.log('evaluated.')
    const story = navigator.clipboard.readText();
    return story;
  });
  console.log('storyResult', storyResult);
  await browser.close();
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
