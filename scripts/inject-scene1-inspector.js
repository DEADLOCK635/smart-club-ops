const fs = require('fs');

let html = fs.readFileSync('public/spline-robot.html', 'utf8');

const target = "log('All done successfully!');";
const snippet = `
        const scene1 = scene.children.find(c => c.name === 'Scene 1');
        if (scene1) {
          log('Scene 1 background: ' + (scene1.background ? (scene1.background.isColor ? ('#' + scene1.background.getHexString()) : 'texture') : 'null'));
          log('Scene 1 children count: ' + scene1.children.length);
          const s1Children = scene1.children.map(c => c.name + ' (' + c.type + ') vis=' + c.visible);
          log('Scene 1 items: ' + s1Children.slice(0, 15).join(', '));
        }
        log('All done successfully!');
`;

html = html.replace(target, snippet);
fs.writeFileSync('public/spline-robot.html', html, 'utf8');
console.log('Injected Scene 1 inspection');
