const fs = require('fs');

let html = fs.readFileSync('public/spline-robot.html', 'utf8');

const target = "log('All done successfully!');";
const snippet = `
        const botObj2 = app.findObjectByName('Bot');
        if (botObj2) {
          log('Bot pos: ' + JSON.stringify(botObj2.position));
          let meshCount = 0;
          let visibleMeshes = 0;
          let names = [];
          if (botObj2.traverse) {
            botObj2.traverse(c => {
              if (c.isMesh) {
                meshCount++;
                if (c.visible) {
                  visibleMeshes++;
                  names.push(c.name);
                }
              }
            });
          }
          log('Bot total meshes: ' + meshCount + ', visible meshes: ' + visibleMeshes);
          log('Visible mesh names: ' + names.slice(0, 10).join(', '));
        }
        log('All done successfully!');
`;

html = html.replace(target, snippet);
fs.writeFileSync('public/spline-robot.html', html, 'utf8');
console.log('Injected Bot meshes traversal');
