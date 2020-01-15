export class DemoPageObject {
  url = 'http://localhost:3001';

  $openAuthButton = '#auth-action';

  async goToPage() {
    return page.goto(this.url, { waitUntil: 'domcontentloaded' });
  }

  async goToFreshPage() {
    await this.goToPage();
    // await page.evaluate(() => localStorage.clear());
  }
}
