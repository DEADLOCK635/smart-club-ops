const fs = require('fs');

const js = fs.readFileSync('public/spline-runtime.js', 'utf8');
const urls = js.match(/https:\/\/[a-zA-Z0-9.\-_/]+/g) || [];
console.log('Unique URLs found in runtime:', [...new Set(urls)]);
