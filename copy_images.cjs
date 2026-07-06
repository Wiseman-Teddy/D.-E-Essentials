const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\1012 G2\\.gemini\\antigravity-ide\\brain\\1e6fb179-0185-4ee3-b562-0751ea219596';
const destDir = 'c:\\Users\\1012 G2\\Downloads\\d-&-e-essentials\\public\\images';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const mapping = [
  ['media__1783169208415.png', 'zara-deep-garden.png'],
  ['media__1783169234030.png', 'zara-lisboa.png'],
  ['media__1783169248432.png', 'zara-bogoss-vibrant-leather.png'],
  ['media__1783169259789.png', 'zara-tuberose.png'],
  ['media__1783169275213.png', 'zara-london-savile-row.png'],
  ['media__1783169518444.png', 'zara-dark-romance.png'],
  ['media__1783169526627.png', 'zara-go-fruity.png'],
  ['media__1783169536742.png', 'zara-amber-fusion.png'],
  ['media__1783169547854.png', 'zara-man-silver.png'],
  ['media__1783169559589.png', 'zara-pink-flambe.png'],
  ['media__1783169718279.png', 'zara-hypnotic-vanilla.png'],
  ['media__1783169727491.png', 'zara-fields-at-nightfall-intense.png']
];

mapping.forEach(([src, dest]) => {
  fs.copyFileSync(path.join(srcDir, src), path.join(destDir, dest));
});

// Update data.ts
const dataFile = 'c:\\Users\\1012 G2\\Downloads\\d-&-e-essentials\\src\\data.ts';
let content = fs.readFileSync(dataFile, 'utf8');

const idMapping = [
  'zara-deep-garden',
  'zara-lisboa',
  'zara-bogoss-vibrant-leather',
  'zara-tuberose',
  'zara-london-savile-row',
  'zara-dark-romance',
  'zara-go-fruity',
  'zara-amber-fusion',
  'zara-man-silver',
  'zara-pink-flambe',
  'zara-hypnotic-vanilla',
  'zara-fields-at-nightfall-intense'
];

idMapping.forEach(id => {
  const regex = new RegExp(`id:\\s*"${id}",(?:[\\s\\S]*?images:\\s*\\[)\\s*"[^"]+"\\s*\\]`, 'g');
  content = content.replace(regex, (match) => {
    return match.replace(/"https:\/\/images\.unsplash\.com[^"]+"/, `"/images/${id}.png"`);
  });
});

fs.writeFileSync(dataFile, content, 'utf8');

console.log('Images copied and data.ts updated successfully.');
