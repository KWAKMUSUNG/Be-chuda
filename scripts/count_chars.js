const fs = require('fs');
const s = fs.readFileSync('frontend/src/app/page.js', 'utf8');
const counts = {
  backtick: (s.match(/`/g)||[]).length,
  single: (s.match(/'/g)||[]).length,
  double: (s.match(/"/g)||[]).length,
  openParen: (s.match(/\(/g)||[]).length,
  closeParen: (s.match(/\)/g)||[]).length,
  openCurly: (s.match(/{/g)||[]).length,
  closeCurly: (s.match(/}/g)||[]).length,
  openBracket: (s.match(/\[/g)||[]).length,
  closeBracket: (s.match(/\]/g)||[]).length
};
console.log(JSON.stringify(counts, null, 2));
