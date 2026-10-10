import fs from 'node:fs';
import path from 'node:path';

// dev-server.mjs 내부의 generateGameHtml 함수 내용을 추출하여 정적 dist/index.html 생성
const devServerSource = fs.readFileSync(path.join(process.cwd(), 'dev-server.mjs'), 'utf-8');

// function generateGameHtml() { return `...`; } 추출
const match = devServerSource.match(/function generateGameHtml\(\)\s*\{\s*return\s*`([\s\S]*?)`;\s*\}/);

if (!match) {
  console.error('✖ generateGameHtml 함수를 찾을 수 없습니다.');
  process.exit(1);
}

const htmlContent = match[1];

// dist 디렉토리 생성 및 index.html 기록
const distDir = path.join(process.cwd(), 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}
fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent, 'utf-8');

// docs 디렉토리 생성 및 index.html 기록 (GitHub Pages /docs 소스 호환)
const docsDir = path.join(process.cwd(), 'docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}
fs.writeFileSync(path.join(docsDir, 'index.html'), htmlContent, 'utf-8');

// 루트 index.html 기록 (GitHub Pages root 소스 및 즉시 실행 지원)
fs.writeFileSync(path.join(process.cwd(), 'index.html'), htmlContent, 'utf-8');

console.log('✔ [배포 빌드 성공] dist/index.html, docs/index.html, index.html 정적 번들 생성 완료 (' + Buffer.byteLength(htmlContent, 'utf-8') + ' bytes)');

