import fs from 'fs';

const content = fs.readFileSync('dev-server.mjs', 'utf8');

const startMarker = 'function generateGameHtml() {\n  return `';
const endMarker = '</html>`;\n}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

const htmlBody = content.slice(startIndex + startMarker.length, endIndex);
const lines = htmlBody.split('\n');

const unescapedBackticks = [];
lines.forEach((line, idx) => {
  // Find backtick not preceded by \
  const matches = line.match(/(?<!\\)`/g);
  if (matches) {
    unescapedBackticks.push({ lineNum: startIndex + idx + 1, text: line.trim() });
  }
});

console.log('Unescaped backticks count:', unescapedBackticks.length);
unescapedBackticks.slice(0, 30).forEach(item => console.log(item));
