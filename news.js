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
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight - Math.floor(Math.random() * 101));
  });
  await new Promise(resolve => setTimeout(resolve, 5000));
  const grokHTML = await page.content();
  const trimmedHTML = grokHTML.split('Ask Grok about today’s news')[1].split('<script')[0];
  const cleanedText = trimmedHTML.replace(/<[^>]+>/g, ' ')
    .replaceAll('  ', ' ').replaceAll('  ', ' ').trim()
    .replaceAll('posts', "posts\n");
 if (!fs.existsSync(indexPath)) fs.writeFileSync(indexPath, '[]', 'utf8');
  const data = fs.readFileSync(indexPath, 'utf8');
  const covered = JSON.parse(data).slice(0, 10).map(a => a.title).join("\n");
  //const extractPrompt = structuredClone(prompts.extractNews);
  //extractPrompt[1].content = extractPrompt[1].content.replace('$html', cleanedText).replace('$covered', covered);
  //console.log(extractPrompt[1].content)
  //const titles = await models.chatGPT(extractPrompt);
  console.log('Latest news stories:', cleanedText);
  const dupePrompt = structuredClone(prompts.removeDuplicateStories);
  dupePrompt[1].content = dupePrompt[1].content.replace('$covered', covered).replace('$titles', cleanedText);
  console.log('dupePrompt', dupePrompt)
  let deduped = await models.chatGPT(dupePrompt);
  if (deduped.split("\n").length < 3) deduped = cleanedText; // check it's sent back a meaningful response
  console.log('Deduped: ',deduped);
  const titlesArray = deduped.split("\n");
  let storyTitle;
  for (let i = 0; i < titlesArray.length; i++) {
    storyTitle = titlesArray[i].trim();
    const clickText = storyTitle.slice(0, 12).trim();
    console.log('Clicking Story: ', titlesArray[i], clickText);
    try {
      await page.locator(`text/${clickText}`).click();
      break;
    } catch(err) {
      console.log(`Click failed :(`);
    }
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
  return { title: storyTitle, background: storyResult };
}

module.exports = news;