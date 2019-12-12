describe('Authentication', () => {
  it('can open the auth window', async () => {
    await page.goto('http://localhost:3001');
    await expect(page).toMatch('Open Authentication');
  });
});
