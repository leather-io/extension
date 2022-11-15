import BigNumber from 'bignumber.js';

import { MarketData, createMarketData, createMarketPair } from '@shared/models/market.model';
import { createMoney, createMoneyFromDecimal } from '@shared/models/money.model';

import { baseCurrencyAmountInQuote, convertAmountToFractionalUnit } from './calculate-money';

const tenMicroStx = createMoney(10, 'STX');
const tenStx = createMoneyFromDecimal(10, 'STX');

const mockWrongMarketData = {
  pair: createMarketPair('BTC' as any, 'USD'),
  price: createMoneyFromDecimal(1, 'EUR' as any, 2),
} as MarketData;

const mockAccurateStxMarketData = createMarketData(
  createMarketPair('STX', 'USD'),
  createMoneyFromDecimal(0.3, 'USD')
);

describe(baseCurrencyAmountInQuote.name, () => {
  test('it throw when passed mismatching currencies', () =>
    expect(() => baseCurrencyAmountInQuote(tenMicroStx, mockWrongMarketData)).toThrowError());

  test('it converts currency small amounts accurately', () => {
    const result = baseCurrencyAmountInQuote(tenMicroStx, mockAccurateStxMarketData);
    expect(result.amount.toString()).toEqual('0.0003');
  });

  test('it converts currency amounts accurately', () => {
    const result = baseCurrencyAmountInQuote(tenStx, mockAccurateStxMarketData);
    expect(result.amount.toString()).toEqual('300');
  });
});

describe(convertAmountToFractionalUnit.name, () => {
  test('it converts a small decimal amount to a fractional unit', () =>
    expect(convertAmountToFractionalUnit(new BigNumber(1), 2).toNumber()).toEqual(100));

  test('it converts 99 as decimal amount to a fractional unit', () =>
    expect(convertAmountToFractionalUnit(new BigNumber(99), 6).toNumber()).toEqual(99000000));
});
