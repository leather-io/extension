# Stacks UI Utils

Legacy utils taken from [Stacks UI](https://github.com/hirosystems/ui). Moved here initially but can be moved to monorepo

## Transactions

### getContractName

This will parse a string and return the contract name.

```ts
const contract =
  'ST12EY99GS4YKP0CP2CFW6SEPWQ2CGVRWK5GHKDRV.market' ||
  'ST12EY99GS4YKP0CP2CFW6SEPWQ2CGVRWK5GHKDRV.market::asset-name';

const name = getContractName(contract);

// market
```

### getAssetName

This will parse a fully qualified asset name string and pull out the name of the asset.

```ts
const contract = 'ST12EY99GS4YKP0CP2CFW6SEPWQ2CGVRWK5GHKDRV.market::asset-name';

const asset = getAssetName(contract);

// asset-name
```

### getAssetStringParts

This will parse a fully qualified asset name string and return the various parts: `address`, `contractName`, `assetName`.

```ts
const contract = 'ST12EY99GS4YKP0CP2CFW6SEPWQ2CGVRWK5GHKDRV.market::asset-name';

const { address, contractName, assetName } = getAssetStringParts(contract);

// ST12EY99GS4YKP0CP2CFW6SEPWQ2CGVRWK5GHKDRV
// market
// asset-name
```

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

## Colors

### generateHash

This takes a string and generates a number has to use with `%`.

```ts
const hash = generateHash('some string');
// get a number between 0-360
const hue = hash % 360;
```

### hashValue

This function generates a hash from a string, and then gets a value from an array. An example usage would be to have an array of colors you'd like to pick from.

```ts
const colors = ['red', 'blue', 'green'];
const string = 'Hiro Protaganist';
const colorFromString = hashValue<('red' | 'blue' | 'green')[]>(string, colors);
// will be one of the colors
```

### stringToHslColor

This takes a string, saturation value, and lightness value to output a color in HSL.

```ts
const string = 'Hiro Protaganist';
const color = stringToHslColor(string, 60, 55);
// an hsl color
```

### moduloRange

This is a helper function to select a number from a range.

```ts
const restrictedHue = moduloRange(hash, [40, 60], true);
// will return a number between 40 and 60, including 60 as an option
```
