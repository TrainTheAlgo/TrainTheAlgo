const fs = require('fs');
const video = require('./video.js');
const deployer = require('./deployer.js');

const content = './content';
const dist = './docs';
const template = './template';
const baseUrl = 'https://trainthealgo.com';
const sections = ["AI", "Software", "Vehicles", "Gaming", "Security", "Politics", "Lifestyle", "Sport", "Markets", "Crypto", "Business", "Space", "Climate", "Physics", "Conferences", "Podcast", "Reviews"];

  
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

const createSections = () => {
    const sectionTemplate = fs.readFileSync(`${template}/section.html`, 'utf-8');
    const sp = sectionTemplate.indexOf('<!-- Start Post -->');
    const ep = sectionTemplate.indexOf('<!-- End Post -->');
    const top = sectionTemplate.slice(0, sp);
    const post = sectionTemplate.slice(sp, ep);
    const end = sectionTemplate.slice(ep);
    sections.forEach((section) => {
        let sectionHTML = top
            .replaceAll('$title', section)
            .replaceAll('$description', `Latest ${section} News`)
            .replaceAll('$image', `/img/backgrounds/${section.toLowerCase()}.jpg`);
        for (let i = 0; i < Math.min(index.length, 9); i++) {
            if (index[i].category !== section) continue;
            sectionHTML += post
                .replaceAll('$title', index[i].title)
                .replaceAll('$description', index[i].description)
                .replaceAll('$image', `/${index[i].path}${index[i].image}`)
                .replaceAll('$link', `/${index[i].path}${index[i].slug}.html`)
        }
        sectionHTML += end;
        fs.writeFileSync(`${dist}/${section.toLowerCase()}.html`, sectionHTML, 'utf-8');
    });
}

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
    const sn = homePage.indexOf('<!-- Start News -->');
    const en = homePage.indexOf('<!-- End News -->');
    const top = homePage.slice(0, sv);
    const vid = homePage.slice(sv, ev);
    const mid1 = homePage.slice(ev, sp);
    const post = homePage.slice(sp, ep);
    const mid2 = homePage.slice(ep, sn);
    let news = homePage.slice(sn, en);
    const end = homePage.slice(en);
    let homeHTML = top;
    for (let i = 0; i < Math.min(videos.length, 4); i++) {
        homeHTML += vid.replaceAll('$video', videos[i].id);
    }
    homeHTML += mid1;
    for (let i = 0; i < Math.min(index.length, 9); i++) {
        homeHTML += post
            .replaceAll('$title', index[i].title)
            .replaceAll('$description', index[i].description)
            .replaceAll('$image', `/${index[i].path}${index[i].image}`)
            .replaceAll('$link', `/${index[i].path}${index[i].slug}.html`)
    }
    homeHTML += mid2;
    newsBundles = {
        tech: [],
        world: [],
        finance: [],
        science: [],
    };
    for (let i = 0; i < index.length; i++) {
        if (["AI", "Software", "Vehicles", "Gaming", "Security"].includes(index[i].category))
            newsBundles.tech.push(index[i]);
        if (["Politics", "Lifestyle", "Sport"].includes(index[i].category))
            newsBundles.world.push(index[i]);
        if (["Markets", "Crypto", "Business"].includes(index[i].category))
            newsBundles.finance.push(index[i]);
        if (["Space", "Climate", "Physics"].includes(index[i].category))
            newsBundles.science.push(index[i]);
    }
    const placeholders = {
        tech: '<!-- Tech News -->',
        world: '<!-- World News -->',
        finance: '<!-- Finance News -->',
        science: '<!-- Science News -->',
    };
    for (const category in placeholders) {
        const linksHTML = newsBundles[category]
            .slice(0, 10).map(article => `<div class="class="text-sm my-52"><a href="${article.link}">${article.title}</a></div>`).join('');
        news = news.replace(placeholders[category], linksHTML);
    }
    homeHTML += news;
    homeHTML += end;
    fs.writeFileSync(`${dist}/index.html`, homeHTML, 'utf-8');
    console.log(`${dist}/index.html`);
}

const buildSitemap = () => {
    const urls = index.map(post => `${baseUrl}/${post.path}${post.slug}.html`);
    sections.forEach((section) => {
        urls.unshift(`${baseUrl}/${section.toLowerCase()}.html`);
    });
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
    createSections();
    videoPages();
    createHomePage();
    buildSitemap();
    await deployer.update();
    console.log('Site built successfully!');
};

buildSite();
