const fs = require('fs');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const news = require('./news.js');
const writer = require('./writer.js');
const illustrator = require('./illustrator.js');

const write = async () => {
  const story = await news.find();    
  const metadata = await writer.write(story.title, story.background);
  illustrator.illustrate(`${metadata.title} ${metadata.description}`, `./content/${metadata.path}${metadata.image}`);
};

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

const command = process.argv[2];
if (command == 'write') write();
if (command == 'browse') browse();
