# Mining Coin — Bytecode Verification

Proof of source code for Mining Coin:

- [`0xA5192CD81bD050B7eeBa24B9DE3C5dd983968A27`](https://ethereumhistory.com/contract/0xA5192CD81bD050B7eeBa24B9DE3C5dd983968A27) — deployed Jun 16 2016 (block 1,718,272)

## Contract

A Frontier/Homestead-era subcurrency with a proof-of-work mining mechanic: `claimMiningReward()` mints 1 token to `block.coinbase` once per block number, making it mineable by whoever processes each block. Based on the ethereum.org "Coin" tutorial with the mining extension from the developer tutorial.

## Compiler

| Field | Value |
|---|---|
| **Compiler** | `soljson-v0.3.3+commit.4dc1cb1.js` (emscripten/JavaScript build) |
| **Optimization** | ON (`compileJSON(source, 1)`) |
| **Runtime size** | 352 bytes |

Download from: https://binaries.soliditylang.org/bin/soljson-v0.3.3+commit.4dc1cb1.js

> **Note:** Native C++ compilers v0.1.5–v0.2.1 all produce 340 bytes due to aggressive bool-return deduplication. The JS v0.3.3 emscripten compiler preserves redundant `ISZERO ISZERO` canonicalization and separate bool return blocks, yielding the correct 352 bytes.

## Verification

```bash
# Download compiler
curl -O https://binaries.soliditylang.org/bin/soljson-v0.3.3+commit.4dc1cb1.js

# Verify
node verify.js
```

Expected: `✅ EXACT MATCH — Mining Coin bytecode verified!`

## Key Insights

1. **JS compiler required** — the emscripten v0.3.3 compiler does NOT merge identical bool return blocks, unlike native C++ v0.1.x–v0.2.x
2. **`ISZERO ISZERO` canonicalization** — the JS optimizer normalizes bool values before returning; native compilers from this era skip this and produce shorter code
3. **Deployed 6 days after v0.3.3 release** (Jun 10 2016) — almost certainly compiled with the latest available version
4. **`miningReward` is private** — `mapping(uint=>address)` with no `public` keyword; no getter generated, only used internally
5. **Mining mechanic**: 1 token per unique block number to whoever is `block.coinbase` (the miner/validator who mined that block)

## Selectors

- `90b98a11` → `sendCoin(address,uint256)` — transfer with bool return
- `bbd39ac0` → `coinBalanceOf(address)` — auto-generated public getter
- `d588acc4` → `claimMiningReward()` — mine 1 token to current block's coinbase

## Files

- `token.sol` — Solidity source
- `runtime.hex` — Expected runtime bytecode (352 bytes)
- `verify.js` — Verification script
