import { createMoney, createMoneyFromDecimal } from '@leather-wallet/utils';
import BigNumber from 'bignumber.js';

import { MarketData, createMarketData, createMarketPair } from '@shared/models/market.model';

import {
  baseCurrencyAmountInQuote,
  convertAmountToFractionalUnit,
  subtractMoney,
  sumMoney,
} from './calculate-money';

const tenMicroStx = createMoney(10, 'STX');
const tenStx = createMoneyFromDecimal(10, 'STX');

const tenBtc = createMoneyFromDecimal(10, 'BTC');

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

describe(sumMoney.name, () => {
  test('it sums two money objects', () => {
    const result = sumMoney([tenMicroStx, tenMicroStx]);
    expect(result.amount.toString()).toEqual('20');
    expect(result.symbol).toEqual(tenMicroStx.symbol);
  });
  test('it throws error when summing different currencies', () => {
    expect(() => sumMoney([tenMicroStx, tenBtc])).toThrowError();
  });
});

describe(subtractMoney.name, () => {
  test('it subtracts two money objects', () => {
    const result = subtractMoney(tenMicroStx, tenMicroStx);
    expect(result.amount.toString()).toEqual('0');
    expect(result.symbol).toEqual(tenMicroStx.symbol);
  });
  test('it throws error when subtracting different currencies', () => {
    expect(() => subtractMoney(tenMicroStx, tenBtc)).toThrowError();
  });
});
