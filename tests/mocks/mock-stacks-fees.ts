import type { Page } from '@playwright/test';

export async function mockStacksFeeRequests(page: Page) {
  await page.route('*/**/v2/fees/transaction', route =>
    route.fulfill({
      json: {
        estimated_cost: {
          write_length: 0,
          write_count: 0,
          read_length: 0,
          read_count: 0,
          runtime: 0,
        },
        estimated_cost_scalar: 6,
        estimations: [
          {
            fee_rate: 35.99908181950457,
            fee: 215,
          },
          {
            fee_rate: 382.0532104229179,
            fee: 2292,
          },
          {
            fee_rate: 65987.51710815083,
            fee: 395925,
          },
        ],
        cost_scalar_change_by_byte: 0.00476837158203125,
      },
    })
  );
}
