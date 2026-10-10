import fs from 'fs';

const content = fs.readFileSync('dev-server.mjs', 'utf8');

const startMarker = 'function generateGameHtml() {\n  return `';
const endMarker = '</html>`;\n}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found!');
  process.exit(1);
}

const prefix = content.slice(0, startIndex + startMarker.length);
const htmlBody = content.slice(startIndex + startMarker.length, endIndex);
const suffix = content.slice(endIndex);

// Escape unescaped ${ and unescaped ` inside htmlBody
let fixedHtmlBody = htmlBody.replace(/(?<!\\)\$\{/g, '\\${');
fixedHtmlBody = fixedHtmlBody.replace(/(?<!\\)`/g, '\\`');

fs.writeFileSync('dev-server.mjs', prefix + fixedHtmlBody + suffix, 'utf8');
console.log('dev-server.mjs escaped both ${ and ` successfully!');
