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

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  
  // Replace $ followed by number: $100 -> KSh 100
  newContent = newContent.replace(/\$(\d+)/g, 'KSh $1');
  
  // Replace common JSX price patterns
  newContent = newContent.replace(/>\$\{/g, '>KSh {');
  newContent = newContent.replace(/>-\$\{/g, '>-KSh {');
  newContent = newContent.replace(/"\$\{/g, '"KSh {');
  newContent = newContent.replace(/Up to \$\{/g, 'Up to KSh {');
  newContent = newContent.replace(/`-\$\$\{/g, '`-KSh ${');
  
  // Replace $ followed by { when it's preceded by space or tab
  newContent = newContent.replace(/([ \t])\$\{/g, '$1KSh {');

  // Replace `-$${` (for template strings where one is literal $)
  newContent = newContent.replace(/`-\$\$\{/g, '`-KSh ${'); // repeated for safety
  
  // Replace `\$$` if any
  newContent = newContent.replace(/`\$\$\{/g, '`KSh ${'); 

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated currency in', file);
  }
});
