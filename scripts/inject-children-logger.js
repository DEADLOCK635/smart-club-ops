const fs = require('fs');

let html = fs.readFileSync('public/spline-robot.html', 'utf8');

const target = "log('Scene children: ' + scene.children.length);";
const snippet = `
        log('Scene children: ' + scene.children.length);
        if (scene) {
          scene.children.forEach((c, idx) => {
            log('Child[' + idx + ']: ' + c.name + ' (' + c.type + ') vis=' + c.visible);
          });
        }
`;

html = html.replace(target, snippet);
fs.writeFileSync('public/spline-robot.html', html, 'utf8');
console.log('Injected scene children logger');
