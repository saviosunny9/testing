// Renders the journey's pose sequence (turning, then tipping down) from the hero's exact viewpoint.
// usage: PORT=4001 node sequence.js <out dir>   (serve this folder first: npm run serve, or on PORT)
// Writes p_<pan>.png and t_<tilt>.png (+ .json geometry) on one canvas size, so one crop fits every frame.
const { spawn } = require('child_process');
const path = require('path');

const out = process.argv[2];
const VIEW = 'color=white&view=custom&cam=-6,12,62&target=0,7.2,0&fov=22&keyx=-12&keyy=26&keyz=22&soft=16&w=2340&h=2600';
const jobs = [];
for (let p = -61; p <= 49; p += 5) jobs.push([`p_${p}`, `pan=${p}&tilt=0`]);
for (let t = 7.5; t <= 75; t += 7.5) jobs.push([`t_${t}`, `pan=-16&tilt=-${t}`]);

let next = 0;
const worker = async () => {
  while (next < jobs.length) {
    const [name, q] = jobs[next++];
    await new Promise((resolve) => {
      const c = spawn('node', [path.join(__dirname, 'shoot.js'), path.join(out, `${name}.png`), `${VIEW}&${q}`], { stdio: 'ignore' });
      c.on('exit', (code) => {
        if (code) console.log('failed', name);
        resolve();
      });
    });
  }
};

Promise.all([worker(), worker(), worker(), worker()]).then(() => console.log('rendered', jobs.length));
