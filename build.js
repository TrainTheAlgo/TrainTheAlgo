// Import required modules
const fs = require('fs');
const path = require('path');

// Constants for directory paths
const CONTENT_DIR = path.join(__dirname, 'content');
const DIST_DIR = path.join(__dirname, 'dist');

// Utility to recursively read all files from a directory
const getFilesRecursively = (dir, baseDir = '') => {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.join(baseDir, entry.name);

        if (entry.isDirectory()) {
            files.push(...getFilesRecursively(fullPath, relativePath));
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
            files.push(relativePath);
        }
    }

    return files;
};

// Parse file paths into chronological article metadata
const parseArticles = (files) => {
    return files.map(file => {
        const parts = file.split(path.sep);
        const year = parts[0];
        const category = parts[1];
        const title = parts[2].replace(/\.html$/, '').replace(/-/g, ' ');
        const url = file.replace(/\\/g, '/');
        
        return { year, category, title, url };
    }).sort((a, b) => a.year - b.year || a.title.localeCompare(b.title));
};

// Generate HTML content for the index page
const generateIndexHTML = (articles) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Article Index</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .article-list { list-style: none; padding: 0; }
        .article-item { margin: 0.5em 0; }
        .article-link { text-decoration: none; color: #007BFF; }
        .article-link:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>Article Index</h1>
    <ul class="article-list">
        ${articles.map(article => `
            <li class="article-item">
                <a class="article-link" href="/${article.url}">${article.year} - ${article.title}</a>
            </li>`).join('')}
    </ul>
</body>
</html>`;
};

// Copy article files to the dist directory
const copyArticles = (files) => {
    for (const file of files) {
        const sourcePath = path.join(CONTENT_DIR, file);
        const destPath = path.join(DIST_DIR, file);
        const destDir = path.dirname(destPath);

        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        fs.copyFileSync(sourcePath, destPath);
    }
};

// Main function to build the site
const buildSite = () => {
    // Clean and recreate dist directory
    if (fs.existsSync(DIST_DIR)) {
        fs.rmSync(DIST_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(DIST_DIR);

    // Get all HTML files from the content directory
    const files = getFilesRecursively(CONTENT_DIR);

    // Parse files into article metadata
    const articles = parseArticles(files);

    // Generate and write the index.html file
    const indexHTML = generateIndexHTML(articles);
    fs.writeFileSync(path.join(DIST_DIR, 'index.html'), indexHTML);

    // Copy all article files to the dist directory
    copyArticles(files);

    console.log('Site built successfully!');
};

// Run the build process
buildSite();
