# Stacks UI Utils

Legacy utils taken from [Stacks UI](https://github.com/hirosystems/ui). Moved here initially but can be moved to monorepo

## Strings

### truncateHex

This will truncate a hex, keeping the 0x out of the offset amount.

```ts
const hex = `0x33cc9a437e704e790958f7bb66492f5ad3a863ab3bcbef47138069725549a353`;

const shortened = truncateHex(hex, 4);
// 0x33cc...a353
```

### truncateMiddle

This will truncate any string in the middle, given an offset amount.

```ts
const hex = `0x33cc9a437e704e790958f7bb66492f5ad3a863ab3bcbef47138069725549a353`;

const shortened = truncateHex(hex, 4);
// 0x33cc...a353

const contract = 'ST12EY99GS4YKP0CP2CFW6SEPWQ2CGVRWK5GHKDRV.market';

const shortenedContract = truncateHex(contract, 4);
// ST12...KDRV.market
```

## Units

### microStxToStx

Converts uSTX to STX.
