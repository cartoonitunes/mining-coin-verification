#!/usr/bin/env node
// Verification script for Mining Coin bytecode
// Requires: soljson-v0.3.3+commit.4dc1cb1.js
// Download from: https://binaries.soliditylang.org/bin/soljson-v0.3.3+commit.4dc1cb1.js

const fs = require('fs'), path = require('path');
const SOLJSON = path.join(__dirname, 'soljson-v0.3.3+commit.4dc1cb1.js');
if (!fs.existsSync(SOLJSON)) {
    console.error('Download soljson-v0.3.3+commit.4dc1cb1.js from:');
    console.error('https://binaries.soliditylang.org/bin/soljson-v0.3.3+commit.4dc1cb1.js');
    process.exit(1);
}
const solc = require(SOLJSON);
const source = fs.readFileSync(path.join(__dirname, 'token.sol'), 'utf8');
const compile = solc.cwrap('compileJSON', 'string', ['string', 'number']);
const r = JSON.parse(compile(source, 1)); // optimizer ON
if (r.errors) { console.error('Errors:', r.errors); process.exit(1); }
const runtime = r.contracts.token.runtimeBytecode;
const expected = fs.readFileSync(path.join(__dirname, 'runtime.hex'), 'utf8').trim();
console.log('Compiled:', runtime.length/2, 'bytes');
console.log('Expected:', expected.length/2, 'bytes');
if (runtime === expected) {
    console.log('\n✅ EXACT MATCH — Mining Coin bytecode verified!');
} else {
    console.log('\n❌ MISMATCH'); process.exit(1);
}
