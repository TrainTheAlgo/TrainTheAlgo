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
        /*
        Log in manually for now, it will store a cookie so you wont need to do it every time
        const delay = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000; // Random typing delay
        await page.type('input[name="text"]', process.env.X_USERNAME, { delay });
        await page.type('input[name="session[password]"]', process.env.X_PASSWORD, { delay });
        await page.click('div[data-testid="LoginForm_Login_Button"]');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        */
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
    headless: false,
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
  const grokHTML = await page.content();
  const trimmedHTML = grokHTML.split('Ask Grok about today’s news')[1].split('<script')[0];
  if (!fs.existsSync(indexPath)) fs.writeFileSync(indexPath, '[]', 'utf8');
  const data = fs.readFileSync(indexPath, 'utf8');
  indexData = JSON.parse(data);
  const covered = indexData.map(a => a.title).join("\n").substr(0,1000);
  const extractPrompt = prompts.extractNews;
  extractPrompt[1].content = extractPrompt[1].content.replace('$html', trimmedHTML).replace('$covered', covered);
  //console.log(extractPrompt[1].content)
  const titles = await models.chatGPT(extractPrompt);
  console.log('Latest news stories:', titles);
  let topStory = titles.split("\n")[0];
  console.log('Top Story: ', topStory);
  await new Promise(resolve => setTimeout(resolve, 5000));
  try {
    await page.locator(`text/${topStory.slice(0, 12)}`).click();
  } catch(err) {
    topStory = titles.split("\n")[1];
    console.log('Second Story: ', topStory);
    await page.locator(`text/${topStory.slice(0, 12)}`).click();
  }
  await new Promise(resolve => setTimeout(resolve, 30000));
  //const storyHTML = await page.content();
  await page.click('button[aria-label="Copy text"]')
  await new Promise(resolve => setTimeout(resolve, 5000));
  const storyResult = await page.evaluate(() => {
    console.log('evaluated.')
    const story = navigator.clipboard.readText();
    return story;
  });
  console.log('storyResult', storyResult);
  //console.log('sleeping...')
  //await new Promise(resolve => setTimeout(resolve, 500000));
  await browser.close();
  return { title: topStory, background: storyResult };
}

module.exports = news;