const fs = require('fs');
const parser = require('@babel/parser');
const path = process.argv[2] || 'frontend/src/app/page.js';
const src = fs.readFileSync(path, 'utf8');
try {
  parser.parse(src, { sourceType: 'module', plugins: ['jsx', 'classProperties', 'optionalChaining'] });
  console.log('PARSE_OK');
} catch (e) {
  console.error('PARSE_ERROR');
  console.error(e.message);
  console.error('Location:', e.loc);
  process.exit(2);
}
