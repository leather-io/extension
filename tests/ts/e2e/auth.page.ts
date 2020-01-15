export class AuthPageObject {
  url = 'http://localhost:8080';

  async goToPage() {
    return page.goto(this.url, { waitUntil: 'domcontentloaded' });
  }
}
