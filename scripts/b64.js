#!/usr/bin/env node
// Usage: node scripts/b64.js "text to encode"
//        node scripts/b64.js --decode "base64string"
const [,, flag, second] = process.argv;
const decode = flag === '--decode';
const input  = decode ? second : flag;

if (!input) {
  console.log('Encode: node scripts/b64.js "your text"');
  console.log('Decode: node scripts/b64.js --decode "base64string"');
  process.exit(1);
}

const result = decode ? Buffer.from(input, 'base64').toString('utf8') : Buffer.from(input).toString('base64');
console.log(result);
