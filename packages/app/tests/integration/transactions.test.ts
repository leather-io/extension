import { Browser, login, wait } from './utils';
import { chromium } from 'playwright';
import { DemoPage } from './page-objects/demo.page';
import { TxPage } from './page-objects/tx.page';
import axios from 'axios';

const STX_ADDRESS = 'ST3YSGSJ2Y359899CQF843QZZK0GFYX9TB2DKK64Q';

describe('Signing transactions', () => {
  let browser: Browser;
  let demoPage: DemoPage;
  beforeEach(async () => {
    browser = await chromium.launch();
    console.log('[DEBUG]: Launched playwright browser');
    const context = await browser.newContext();
    demoPage = await DemoPage.init(context);
  }, 20000);

  afterEach(async () => {
    try {
      await browser.close();
    } catch (error) {
      // console.error(error);
    }
  });

  test('Can contract call with the status app', async () => {
    await login(demoPage, browser);
    await wait(5000);
    const stxAddress = await demoPage.getSTXAddress();
    expect(stxAddress).toEqual(STX_ADDRESS);
    const $statusInputElement = await demoPage.page.$(demoPage.statusInput);
    if (!$statusInputElement) {
      throw 'Could not find username field';
    }
    await demoPage.page.type(demoPage.statusInput, 'hello, world!');
    await demoPage.page.click(demoPage.submitStatusButton);
    const txPage = await TxPage.getTxPage(browser);
    await txPage.page.screenshot({ path: './tests/screenshots/tx.png' });
    await txPage.page.waitForSelector(txPage.$confirmTxButton);
    await txPage.page.click(txPage.$confirmTxButton);
    const statusTxid = await demoPage.getStatusTxid();
    expect(statusTxid).not.toBeFalsy();
    const txRes = await axios.get(`http://localhost:3999/sidecar/v1/tx/${statusTxid}`);
    const tx = txRes.data;
    expect(tx.tx_type).toEqual('contract_call');
    expect(tx.contract_call.function_name).toEqual('write-status!');
    expect(tx.contract_call.function_args[0].repr).toEqual('"hello, world!"');
    expect(tx.contract_call.contract_id).toEqual('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6.status');
  }, 60_000);
});
