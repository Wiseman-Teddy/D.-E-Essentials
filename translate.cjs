const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const translations = [
  [/Oud Mystique/g, "Mystical Oud"],
  [/OUD MYSTIQUE/g, "MYSTICAL OUD"],
  [/Rouge Séduction/g, "Red Seduction"],
  [/ROUGE SÉDUCTION/g, "RED SEDUCTION"],
  [/Santal Impérial/g, "Imperial Sandalwood"],
  [/Fleur de Minuit/g, "Midnight Flower"],
  [/L'Élixir d'Or/g, "Golden Elixir"],
  [/Noir Absolu/g, "Absolute Black"],
  [/Céleste Fresh/g, "Celestial Fresh"],
  [/La Confrérie de Sillage/g, "The Fragrance Brotherhood"],
  [/\bAtelier\b/g, "Studio"],
  [/\batelier\b/g, "studio"],
  [/\bATELIER\b/g, "STUDIO"]
];

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  
  translations.forEach(([regex, replacement]) => {
    newContent = newContent.replace(regex, replacement);
  });

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Translated in', file);
  }
});
