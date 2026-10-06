const fs = require('fs');

const html = fs.readFileSync('public/spline-robot-raw.html', 'utf8');
const urls = html.match(/https:\/\/[a-zA-Z0-9.\-_/?&=#%]+/g) || [];
console.log('All URLs in spline-robot-raw.html:');
console.log([...new Set(urls)]);
