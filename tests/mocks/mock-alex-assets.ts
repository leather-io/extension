import type { Page } from '@playwright/test';

const mockedAlexTokens = [
  {
    icon: 'https://images.ctfassets.net/frwmwlognk87/4gKhLHw09nsWjmPlufTjmT/d5432569911d82c3052755b77e0f64dc/LONGcoin-image-2.png',
    id: 'token-wlong',
    isRebaseToken: false,
    name: 'LONG',
    underlyingToken: 'SP265WBWD4NH7TVPYQTVD23X3607NNK4484DTXQZ3.longcoin::longcoin',
    underlyingTokenDecimals: 6,
    wrapToken: 'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-wlong::wlong',
  },
  {
    icon: 'https://images.ctfassets.net/frwmwlognk87/43mQaoU8JsfWr5HPWQZN5b/7f56c9d5837e03c3d4535ba073ba1c64/image_1819.png',
    id: 'token-wnope',
    isRebaseToken: false,
    name: 'NOT',
    underlyingToken: 'SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.nope::NOT',
    underlyingTokenDecimals: 0,
    wrapToken: 'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-wnot::wnot',
    wrapTokenDecimals: 8,
  },
];

const mockedAlexPools = [
  {
    tokenX: 'token-wstx',
    tokenY: 'age000-governance-token',
    factor: 100000000,
  },
  {
    tokenX: 'age000-governance-token',
    tokenY: 'auto-alex-v3',
    factor: 5000000,
  },
  {
    tokenX: 'token-wstx',
    tokenY: 'token-abtc',
    factor: 100000000,
  },
];

const mockedAlexTokenPrices = [
  {
    contract_id: 'SP265WBWD4NH7TVPYQTVD23X3607NNK4484DTXQZ3.longcoin',
    last_price_usd: 4.23105713004e-7,
  },
  {
    contract_id: 'SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.nope',
    last_price_usd: 0.000046211724535772,
  },
];

export async function mockMainnetAlexAssetsRequest(page: Page) {
  await page.route('https://alex-sdk-api.alexlab.co/', route =>
    route.fulfill({
      json: { pools: mockedAlexPools, tokens: mockedAlexTokens },
    })
  );
}

export async function mockMainnetAlexTokenPricesRequest(page: Page) {
  await page.route('https://api.alexgo.io/v2/public/token-prices', route =>
    route.fulfill({ json: { data: mockedAlexTokenPrices } })
  );
}
