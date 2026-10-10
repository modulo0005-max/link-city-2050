import fs from 'fs';

const content = fs.readFileSync('dev-server.mjs', 'utf8');
const lines = content.split('\n');
const unescaped = [];

lines.forEach((line, idx) => {
  // Check for ${ that is NOT preceded by \
  // Note: in regex, (?<!\\)\$\{
  const matches = line.match(/(?<!\\)\$\{/g);
  if (matches) {
    unescaped.push({ lineNum: idx + 1, text: line.trim() });
  }
});

console.log('Total unescaped found:', unescaped.length);
unescaped.forEach(item => {
  console.log(`Line ${item.lineNum}: ${item.text}`);
});
