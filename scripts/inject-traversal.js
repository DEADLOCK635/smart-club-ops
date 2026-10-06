const fs = require('fs');

let html = fs.readFileSync('public/spline-robot.html', 'utf8');

const target = "log('Hiding completed.');";
const snippet = `
        const topPart = app.findObjectByName('Top part');
        if (topPart) {
          const meshes = [];
          if (typeof topPart.traverse === 'function') {
            topPart.traverse(c => {
              if (c.isMesh) meshes.push(c.name + ' (pos:' + Math.round(c.position.x) + ',' + Math.round(c.position.y) + ',' + Math.round(c.position.z) + ')');
            });
          }
          log('TopPart meshes (' + meshes.length + '): ' + meshes.slice(0, 10).join(', '));
        }
        log('Hiding completed.');
`;

html = html.replace(target, snippet);
fs.writeFileSync('public/spline-robot.html', html, 'utf8');
console.log('Injected Top part traversal check');
