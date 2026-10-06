const fs = require('fs');

let html = fs.readFileSync('public/spline-robot.html', 'utf8');

const target = "log('All done successfully!');";
const snippet = `
        const cam = app._camera;
        if (cam) {
          log('Cam: pos=' + Math.round(cam.position.x) + ',' + Math.round(cam.position.y) + ',' + Math.round(cam.position.z) + ' rot=' + Math.round(cam.rotation.x*57) + ',' + Math.round(cam.rotation.y*57) + ',' + Math.round(cam.rotation.z*57));
        }
        const scene = app._scene;
        if (scene) {
          log('Scene background: ' + (scene.background ? (scene.background.isColor ? ('#' + scene.background.getHexString()) : 'texture') : 'null'));
          log('Scene children: ' + scene.children.length);
        }
        log('All done successfully!');
`;

html = html.replace(target, snippet);
fs.writeFileSync('public/spline-robot.html', html, 'utf8');
console.log('Injected scene inspector');
