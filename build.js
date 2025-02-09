const fs = require('fs');
const video = require('./video.js');

const content = './content';
const dist = './docs';
const template = './template';
const baseUrl = 'https://trainthealgo.com';
  
const indexFile = fs.readFileSync(`${content}/index.json`, 'utf-8');
const index = JSON.parse(indexFile);


const copyArticles = () => {
    const postTemplate = fs.readFileSync(`${template}/post.html`, 'utf-8');
    for (const post of index) {
        const file = `${content}/${post.path}${post.slug}.html`;
        console.log(file);
        const distDirectory = `${dist}/${post.path}`;
        if (!fs.existsSync(distDirectory)) fs.mkdirSync(distDirectory, { recursive: true });
        const postContent = fs.readFileSync(file, 'utf-8');
        const postHTML = postTemplate
            .replaceAll('$title', post.title)
            .replaceAll('$description', post.description)
            .replaceAll('$image', post.image)
            .replaceAll('$content', postContent)
        fs.writeFileSync(`${distDirectory}${post.slug}.html`, postHTML, 'utf-8');
        const media = `${content}/${post.path}${post.image}`;
        if (fs.existsSync(media)) {
            const destination = `${dist}/${post.path}${post.image}`;
            console.log(destination)
            fs.copyFileSync(media, destination);
        }
    }
};

const videoPages = () => {
    const videoTemplate = fs.readFileSync(`${template}/video.html`, 'utf-8');
    const videosFile = fs.readFileSync(`${content}/videos.json`, 'utf-8');
    const videos = JSON.parse(videosFile);
    const distDirectory = `${dist}/videos/`;
    if (!fs.existsSync(distDirectory)) fs.mkdirSync(distDirectory, { recursive: true });
    for (const v of videos) {     
        const videoHTML = videoTemplate
            .replaceAll('$title', v.title)
            .replaceAll('$description', v.description)
            .replaceAll('$video', v.id)
        fs.writeFileSync(`${distDirectory}/${v.id}.html`, videoHTML, 'utf-8');
    }
};

const createHomePage = () => {
    const homePage = fs.readFileSync(`${template}/index.html`, 'utf-8');
    const videosFile = fs.readFileSync(`${content}/videos.json`, 'utf-8');
    const videos = JSON.parse(videosFile);
    const sv = homePage.indexOf('<!-- Start Video -->');
    const ev = homePage.indexOf('<!-- End Video -->');
    const sp = homePage.indexOf('<!-- Start Post -->');
    const ep = homePage.indexOf('<!-- End Post -->');
    const top = homePage.slice(0, sv);
    const vid = homePage.slice(sv, ev);
    const mid = homePage.slice(ev, sp);
    const post = homePage.slice(sp, ep);
    const end = homePage.slice(ep);
    let homeHTML = top;
    for (let i = 0; i < Math.min(videos.length, 4); i++) {
        homeHTML += vid.replaceAll('$video', videos[i].id);
    }
    homeHTML += mid;
    for (let i = 0; i < Math.min(index.length, 9); i++) {
        homeHTML += post
            .replaceAll('$title', index[i].title)
            .replaceAll('$description', index[i].description)
            .replaceAll('$image', `/${index[i].path}${index[i].image}`)
            .replaceAll('$link', `/${index[i].path}${index[i].slug}.html`)
    }
    homeHTML += end;
    fs.writeFileSync(`${dist}/index.html`, homeHTML, 'utf-8');
    console.log(`${dist}/index.html`);
}

const buildSitemap = () => {
    const urls = index.map(post => `${baseUrl}/${post.path}${post.slug}.html`);
    urls.unshift(`${baseUrl}`);
    const sitemapContent = urls.join('\n');
    fs.writeFileSync(`${dist}/sitemap.txt`, sitemapContent, 'utf-8');
    console.log(`${dist}/sitemap.txt`);
};

const buildSite = async () => {
    if (fs.existsSync(dist)) fs.rmSync(dist, { recursive: true, force: true });
    fs.mkdirSync(dist);
    fs.cpSync(template, dist, { recursive: true });
    await video.fetch();
    copyArticles();
    videoPages();
    createHomePage();
    buildSitemap();
    console.log('Site built successfully!');
};

buildSite();
