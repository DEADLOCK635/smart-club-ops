const fs = require('fs');

let html = fs.readFileSync('public/spline-robot.html', 'utf8');

const target = "log('All done successfully!');";
const snippet = `
        const botObj2 = app.findObjectByName('Bot');
        if (botObj2) {
          log('Bot pos: ' + JSON.stringify(botObj2.position));
          log('Bot scale: ' + JSON.stringify(botObj2.scale));
          log('Bot rot: ' + JSON.stringify(botObj2.rotation));
          log('Bot children: ' + botObj2.children.map(c => c.name + ' vis=' + c.visible).join(', '));
        }
        log('All done successfully!');
`;

html = html.replace(target, snippet);
fs.writeFileSync('public/spline-robot.html', html, 'utf8');
console.log('Injected Bot children inspection');
