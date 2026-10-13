import fs from 'node:fs';
import path from 'node:path';

// 1. dev-server.mjs 내부의 단독 실행 HTML 코드 추출
const devServerSource = fs.readFileSync(path.join(process.cwd(), 'dev-server.mjs'), 'utf-8');

const startTag = '<!DOCTYPE html>';
const endTag = '</html>';
const startIndex = devServerSource.indexOf(startTag);
const endIndex = devServerSource.lastIndexOf(endTag);

if (startIndex === -1 || endIndex === -1) {
  console.error('✖ HTML 태그(<!DOCTYPE html> ~ </html>)를 찾을 수 없습니다.');
  process.exit(1);
}

const rawHtml = devServerSource.slice(startIndex, endIndex + endTag.length);

// 2. dev-server.mjs 템플릿 리터럴 내부에서 이스케이프되었던 \` 와 \${ 를 순수 브라우저 실행 코드로 복원
const htmlContent = rawHtml.replace(/\\`/g, '`').replace(/\\\$\{/g, '${');

// 3. 브라우저 런타임 자바스크립트 구문 무결성 사전 검증 (Syntax Validation Guard)
const scriptStart = htmlContent.indexOf('<script>');
const scriptEnd = htmlContent.lastIndexOf('</script>');
if (scriptStart !== -1 && scriptEnd !== -1) {
  const scriptCode = htmlContent.slice(scriptStart + 8, scriptEnd);
  try {
    new Function(scriptCode);
    console.log('✔ [사전 검증 통과] 자바스크립트 런타임 구문 정상 (문법 오류 0개)');
  } catch (err) {
    console.error('✖ [사전 검증 실패] 번들 내 자바스크립트 구문 오류 발생:', err.message);
    process.exit(1);
  }
}

// 4. 출력 디렉토리 정의
const distDir = path.join(process.cwd(), 'dist');
const docsDir = path.join(process.cwd(), 'docs');

[distDir, docsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 5. index.html 배포 파일 기록 (dist, docs, 루트 3곳 동기화)
fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent, 'utf-8');
fs.writeFileSync(path.join(docsDir, 'index.html'), htmlContent, 'utf-8');
fs.writeFileSync(path.join(process.cwd(), 'index.html'), htmlContent, 'utf-8');

// 6. GitHub Pages Jekyll 엔진 무시를 위한 .nojekyll 생성
['.', 'dist', 'docs'].forEach(target => {
  const nojekyllPath = path.join(process.cwd(), target, '.nojekyll');
  if (!fs.existsSync(nojekyllPath)) {
    fs.writeFileSync(nojekyllPath, '', 'utf-8');
  }
});

// 7. favicon.svg 에셋 동기화
const rootFavicon = path.join(process.cwd(), 'favicon.svg');
if (fs.existsSync(rootFavicon)) {
  fs.copyFileSync(rootFavicon, path.join(distDir, 'favicon.svg'));
  fs.copyFileSync(rootFavicon, path.join(docsDir, 'favicon.svg'));
}

console.log('✔ [배포 빌드 성공] dist/index.html, docs/index.html, index.html 정적 번들 생성 완료 (' + Buffer.byteLength(htmlContent, 'utf-8') + ' bytes)');



