// Writes the booking wizard's service list from the master catalog (api/_catalog.json).
// usage: node tools/catalog.mjs   (run after any catalog change; tests fail if they drift)
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const cat = JSON.parse(readFileSync(join(root, 'api/_catalog.json'), 'utf8'));
export const WIZARD = 'assets/book/book.v10.js';
const order = ['doctor', 'iv', 'care', 'b2b', 'test'];
const list = Object.entries(cat.services)
  .map(([k, s]) => ({ k, n: { en: s.en, es: s.es }, p: s.price, g: s.group, m: s.kind === 'mobile', pay: s.payment, ...(s.public === false ? { hidden: true } : {}) }))
  .sort((a, b) => order.indexOf(a.g) - order.indexOf(b.g));
const sv = 'var SV = ' + JSON.stringify(list) + ';';
const f = join(root, WIZARD);
const src = readFileSync(f, 'utf8');
const out = src.replace(/\/\*SV\*\/[\s\S]*?\/\*SV-END\*\//, `/*SV*/${sv}/*SV-END*/`);
if (out === src && !src.includes(sv)) throw new Error('SV markers not found');
writeFileSync(f, out);
console.log(`wizard catalog: ${list.length} services`);
