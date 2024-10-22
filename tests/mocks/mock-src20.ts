import type { Page } from '@playwright/test';

const mockedSrc20Tokens = [
  {
    address: 'bc1qgaj8smw5xshswlq4uk7qd0kmlhfta8mhw8jh0s',
    p: 'SRC-20',
    tick: 'pxl',
    amt: '6182.000000000000000000',
    block_time: '2024-06-19T11:34:12.000Z',
    last_update: 848619,
    deploy_tx: '2fb1ac020ba71a932122049c2b0df6e98193d5f003bbcde5a9ca4ca4d87894a4',
    deploy_img:
      'https://stampchain.io/stamps/2fb1ac020ba71a932122049c2b0df6e98193d5f003bbcde5a9ca4ca4d87894a4.svg',
  },
];

const mockedStamps = [
  {
    cpid: 'A12389174053352215537',
    stamp: 259109,
    stamp_base64:
      'R0lGODlhKAAoAKIAAP////39/QAAAP7+/vz8/Pn5+f///wAAACH5BAUAAAYALAAAAAAoACgAAAPAOLHc/jDKSau9OOvNu/9gKI5kaZ6eoK5Cw6rM+0byHMhxDT8rvy8/YMvSo7mGuUuQslzSkEToTfrMNHU+H+vo0FGduCS34hwLu1RIUQ29KstT8/mdDrox3l04rtkLt3MTBAEAhQADCgwFJAOGjo+QkY6JD4UshgKSmpuOmZiWnKGSnp2XAKaXK52nKp+QpK+nrrKWpLaqoKO0u7arsbu1qr25wLCusMi8s8nFxM3Dysu4wcGt0LfTotqPxtves4YJADs=',
    stamp_url:
      'https://stampchain.io/stamps/a3b095f1f5267897a873ac31bf787590391d10d10debea7598c38bcefedefade.gif',
    stamp_mimetype: 'image/gif',
    tx_hash: 'a3b095f1f5267897a873ac31bf787590391d10d10debea7598c38bcefedefade',
    divisible: 0,
    supply: 80,
    locked: 1,
    creator: 'bc1q9s9ltezcf7dqnp9f3q4telmaxjhuny0uvgz7wt',
    creator_name: null,
    is_btc_stamp: 0,
    balance: 78,
  },
];

const mockedStampChainResponse = {
  page: 1,
  limit: 1000,
  totalPages: 1,
  total: 2,
  last_block: 864803,
  btc: {
    address: 'bc1qgaj8smw5xshswlq4uk7qd0kmlhfta8mhw8jh0s',
    balance: 0.00114478,
    txCount: 125,
    unconfirmedBalance: 0,
    unconfirmedTxCount: 0,
  },
  data: {
    stamps: mockedStamps,
    src20: mockedSrc20Tokens,
  },
};

export async function mockMainnetTestAccountStampchainRequest(page: Page) {
  await page.route('**/stampchain.io/api/v2/balance/**', route =>
    route.fulfill({
      json: mockedStampChainResponse,
    })
  );
}
