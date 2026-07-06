const fs = require('fs');

const dataFile = 'c:\\Users\\1012 G2\\Downloads\\d-&-e-essentials\\src\\data.ts';
let content = fs.readFileSync(dataFile, 'utf8');

const unsplashImages = [
  "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=600"
];

let i = 0;
content = content.replace(/"\/images\/zara-[^"]+\.png"/g, (match) => {
  const replacement = `"${unsplashImages[i % unsplashImages.length]}"`;
  i++;
  return replacement;
});

fs.writeFileSync(dataFile, content, 'utf8');
console.log('Reverted Zara product images to standard placeholders.');
