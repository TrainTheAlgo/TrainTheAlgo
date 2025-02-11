const fs = require('fs');
const indexPath = './content/index.json';
const data = fs.readFileSync(indexPath, 'utf8');
indexData = JSON.parse(data);
const covered = indexData.map(a => a.title).join("\n").substr(0,1000);
console.log(covered)