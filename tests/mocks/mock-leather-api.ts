import type { Page } from '@playwright/test';

const mockedSip10TokenMap = {
  'SP265WBWD4NH7TVPYQTVD23X3607NNK4484DTXQZ3.longcoin': {
    assetIdentifier: 'SP265WBWD4NH7TVPYQTVD23X3607NNK4484DTXQZ3.longcoin::longcoin',
    name: 'LONGcoin',
    symbol: 'LONG',
    decimals: 6,
    image: 'https://storage.googleapis.com/longcoin/LONGcoin-image.png',
    principal: 'SP265WBWD4NH7TVPYQTVD23X3607NNK4484DTXQZ3.longcoin',
  },
};

const mockedSip10PriceMap = {
  'SP265WBWD4NH7TVPYQTVD23X3607NNK4484DTXQZ3.longcoin': {
    price: 4.23105713004e-7,
    change24h: 0,
  },
};

const mockedRuneTokenMap = {
  DOGGOTOTHEMOON: {
    spacedRuneName: 'DOG•GO•TO•THE•MOON',
    decimals: 5,
    symbol: '🐕',
  },
};

const mockedRuneTokenPriceMap = {
  DOGGOTOTHEMOON: {
    price: 0.002724292538866889,
    change24h: -4.14,
    lastPriceAt: '2025-08-20T11:13:58.555Z',
  },
};

export async function mockLeatherApiRequests(page: Page) {
  await page.route('**/v1/tokens/rune?format=map', route =>
    route.fulfill({
      json: {
        format: 'map',
        data: mockedRuneTokenMap,
      },
    })
  );

  await page.route('**/v1/market/prices/rune?format=map', route =>
    route.fulfill({
      json: {
        format: 'map',
        data: mockedRuneTokenPriceMap,
      },
    })
  );

  await page.route('**/v1/tokens/sip10s?format=map', route =>
    route.fulfill({
      json: {
        format: 'map',
        data: mockedSip10TokenMap,
      },
    })
  );

  await page.route(
    '**/v1/tokens/sip10s/SP265WBWD4NH7TVPYQTVD23X3607NNK4484DTXQZ3.longcoin',
    route =>
      route.fulfill({
        json: mockedSip10TokenMap['SP265WBWD4NH7TVPYQTVD23X3607NNK4484DTXQZ3.longcoin'],
      })
  );

  await page.route('**/v1/market/prices/sip10s?format=map', route =>
    route.fulfill({
      json: {
        format: 'map',
        data: mockedSip10PriceMap,
      },
    })
  );

  await page.route('**/v1/market/fiat-rates', route =>
    route.fulfill({
      json: {
        rates: {
          EUR: 0.85,
          GBP: 0.73,
          JPY: 110.0,
        },
      },
    })
  );

  await page.route('**/v1/market/prices/native?format=map', route =>
    route.fulfill({
      json: {
        format: 'map',
        data: {
          BTC: { price: 45000, change24h: 2.5 },
          STX: { price: 0.85, change24h: -1.2 },
        },
      },
    })
  );

  await page.route('**/v1/utxos/**', route =>
    route.fulfill({
      json: [
        {
          txid: 'a8e2a50d68479d233ce3cd31cdca04160f003ca6ac49149070b6ade627553e80',
          vout: 1,
          value: '200000',
          height: 98330,
          address: 'tb1q4qgnjewwun2llgken94zqjrx5kpqqycaz5522d',
          path: "m/84'/1'/0'/0/0",
        },
      ],
    })
  );

  await page.route('**/v1/transactions/**', route =>
    route.fulfill({
      json: {
        meta: {
          page: 1,
          pageSize: 1,
          totalPages: 1,
          totalItems: 1,
        },
        data: [
          {
            txid: 'a8e2a50d68479d233ce3cd31cdca04160f003ca6ac49149070b6ade627553e80',
            height: 98330,
            time: 1755767769,
            vin: [
              {
                txid: '54ac9fde41f25591f18fa3075f8f084d8c59f71cc1a817fbf39c779a7255529b',
                n: 1,
                address: 'tb1q4fvs5cm7qjgw8qa0fr548ewwxhl5htkydv7ssm',
                value: '337677',
              },
              {
                txid: '5e5fc7f548ca4d7083030f30052e29618b4b5a625521f194eb5962ebdf32ce15',
                n: 1,
                address: 'tb1q4fvs5cm7qjgw8qa0fr548ewwxhl5htkydv7ssm',
                value: '1616428',
              },
              {
                txid: 'c535a536a3679bf4c09ef00257902cf31df2166a9d0ed7d8df27f6e7bc10c4a9',
                n: 1,
                address: 'tb1q4fvs5cm7qjgw8qa0fr548ewwxhl5htkydv7ssm',
                value: '24783',
              },
            ],
            vout: [
              {
                n: 0,
                address: 'tb1q4d2cn30fkvkamtgthyvtzgd6909mwy4mugtsgk',
                value: '1778612',
              },
              {
                n: 1,
                owned: true,
                address: 'tb1q4qgnjewwun2llgken94zqjrx5kpqqycaz5522d',
                path: "m/84'/1'/0'/0/0",
                value: '200000',
              },
            ],
          },
        ],
      },
    })
  );
}
