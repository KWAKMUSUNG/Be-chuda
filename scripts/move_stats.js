const fs = require('fs');
const p = 'frontend/src/app/page.js';
let s = fs.readFileSync(p, 'utf8');
const startMarker = '<div className="bg-gray-900/20 border border-gray-900 rounded-2xl p-6 h-[600px] flex flex-col"';
const start = s.indexOf(startMarker);
if(start === -1){ console.error('start not found'); process.exit(1); }
// find the matching closing </div> for this block by searching forward for '\n      </main>' after the block end; but block ends with two nested divs. We'll search for the specific closing sequence that follows in file: '</div>\n      </main>'
const endMarker = '\n      </main>';
let end = s.indexOf(endMarker, start);
if(end === -1){ // fallback: find the next "</div>\n        </main>"
  end = s.indexOf('\n        </main>', start);
}
if(end === -1){ console.error('end not found'); process.exit(1); }
// find the last closing </div> before end
const block = s.substring(start, end);
console.log('block length', block.length);
// remove block
s = s.slice(0, start) + s.slice(end);
// find insertion point: before the sequence '\n                    </div>\n                </>' which closes the inner fragment
const insertMarker = '\n                    </div>\n                </>';
const insertPos = s.indexOf(insertMarker);
if(insertPos === -1){ console.error('insert marker not found'); fs.writeFileSync(p + '.bak', s); process.exit(1); }
const newS = s.slice(0, insertPos + insertMarker.length) + '\n' + block + s.slice(insertPos + insertMarker.length);
fs.writeFileSync(p + '.new', newS);
console.log('written to .new -- please review');
