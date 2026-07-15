const fs = require('fs');
const p = 'frontend/src/app/page.js';
let s = fs.readFileSync(p, 'utf8');
const startMarker = '<div className="bg-gray-900/20 border border-gray-900 rounded-2xl p-6 h-[600px] flex flex-col"';
const start = s.indexOf(startMarker);
if(start === -1){ console.error('start not found'); process.exit(1); }
const end = s.indexOf('\n      </main>', start);
if(end === -1){ console.error('end not found'); process.exit(1); }
const block = s.substring(start, end);
// remove block
s = s.slice(0, start) + s.slice(end);
// find inner close pos
const innerClose = s.indexOf('\n                </>\n              )}');
if(innerClose === -1){ console.error('innerClose not found'); process.exit(1); }
// find next ')}' after innerClose
const rest = s.slice(innerClose+1);
const nextCloseRel = rest.indexOf(')}');
if(nextCloseRel === -1){ console.error('nextClose not found'); process.exit(1); }
const insertPos = innerClose + 1 + nextCloseRel;
// insert block before nextClose (i.e., before ')}')
const newS = s.slice(0, insertPos) + '\n' + block + s.slice(insertPos);
fs.writeFileSync(p + '.moved', newS);
console.log('wrote .moved');
