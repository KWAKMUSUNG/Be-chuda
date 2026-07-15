const fs = require('fs');
const p='frontend/src/app/page.js';
const s=fs.readFileSync(p,'utf8');
const lines=s.split('\n');
// 1-based line numbers from inspection
const from=477; const to=505; const insertAfter=471;
const block = lines.slice(from-1,to).join('\n');
const newLines = lines.slice(0,insertAfter).concat([block]).concat(lines.slice(insertAfter));
fs.writeFileSync(p+'.moved2', newLines.join('\n'));
console.log('wrote moved2');
