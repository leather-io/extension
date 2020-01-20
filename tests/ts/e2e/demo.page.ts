export class DemoPageObject {
  url = 'http://localhost:3001';

  $openAuthButton = '[data-test="button-open-connect-modal"]';

  async goToPage() {
    return page.goto(this.url, { waitUntil: 'domcontentloaded' });
  }

  async goToFreshPage() {
    await this.goToPage();
  }
}
