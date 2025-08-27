import {
  ClarityType,
  ContractCallPayload,
  IntCV,
  StacksTransactionWire,
  TokenTransferPayloadWire,
  addressToString,
  createAddress,
  cvToString,
  serializeCV,
} from '@stacks/transactions';
import BigNumber from 'bignumber.js';

import type { CryptoCurrency } from '@leather.io/models';
import {
  baseCurrencyAmountInQuote,
  convertToMoneyTypeWithDefaultOfZero,
  createMoney,
  isDefined,
  isEmptyString,
  microStxToStx,
} from '@leather.io/utils';

import { formatCurrency } from '@app/common/currency-formatter';
import { removeTrailingNullCharacters } from '@app/common/utils';
import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';

function safeAddressToString(address: string) {
  try {
    return addressToString(createAddress(address));
  } catch (error) {
    return '';
  }
}

export function useStacksTransactionSummary(token: CryptoCurrency) {
  // TODO: unsafe type assumption
  const tokenMarketData = useCryptoCurrencyMarketDataMeanAverage(token as 'BTC' | 'STX');

  // RPC requests do not show a review step
  if (isEmptyString(token)) return { formSentSummaryTxState: null, formReviewTxSummary: null };

  function formSentSummaryTxState(
    txId: string,
    signedTx: StacksTransactionWire,
    decimals?: number
  ) {
    return {
      state: {
        txLink: {
          blockchain: 'stacks',
          txid: txId || '',
        },
        txId,
        ...formReviewTxSummary(signedTx, token, decimals),
      },
    };
  }

  // This function violates the rule of not pre-formatting data
  function formReviewTxSummary(tx: StacksTransactionWire, symbol = 'STX', decimals = 6) {
    if (symbol !== 'STX') {
      return formSip10TxSummary(tx, symbol, decimals);
    }

    // WARNING: this is a very dangerous type cast as it can totally be another tx type...
    const payload = tx.payload as TokenTransferPayloadWire;
    const txValue = payload.amount;
    const fee = tx.auth.spendingCondition.fee;
    const memoContent = payload?.memo?.content ?? '';
    const memoDisplayText = removeTrailingNullCharacters(memoContent) || 'No memo';

    return {
      recipient: safeAddressToString(payload?.recipient?.value),
      fee: formatCurrency(convertToMoneyTypeWithDefaultOfZero('STX', Number(fee))),
      totalSpend: formatCurrency(
        convertToMoneyTypeWithDefaultOfZero('STX', Number(txValue) + Number(fee))
      ),
      symbol: 'STX',
      txValue: microStxToStx(Number(txValue)).toString(),
      sendingValue: formatCurrency(convertToMoneyTypeWithDefaultOfZero('STX', Number(txValue))),
      txFiatValue: formatCurrency(
        baseCurrencyAmountInQuote(createMoney(Number(payload.amount), 'STX'), tokenMarketData)
      ),
      txFiatValueSymbol: tokenMarketData.price.symbol,
      nonce: String(tx.auth.spendingCondition.nonce),
      memoDisplayText,
    };
  }

  function getSip10MemoDisplayText(payload: ContractCallPayload): string {
    const noMemoText = 'No memo';
    if (!isDefined(payload.functionArgs[3])) {
      return noMemoText;
    }
    const isSome = payload.functionArgs[3].type === ClarityType.OptionalSome;
    return isSome ? serializeCV(payload.functionArgs[3]) : noMemoText;
  }

  function formSip10TxSummary(tx: StacksTransactionWire, symbol: string, decimals = 6) {
    const payload = tx.payload as ContractCallPayload;
    const fee = tx.auth.spendingCondition.fee;
    const txValue = Number((payload.functionArgs[0] as IntCV).value);
    const memoDisplayText = getSip10MemoDisplayText(payload);

    const sendingValue = formatCurrency(
      convertToMoneyTypeWithDefaultOfZero(symbol, txValue, decimals)
    );
    const feeValue = formatCurrency(convertToMoneyTypeWithDefaultOfZero('STX', Number(fee)));
    const totalSpend = `${sendingValue} + ${feeValue}`;

    const currencyTxAmount = baseCurrencyAmountInQuote(
      createMoney(txValue, symbol.toUpperCase(), decimals),
      tokenMarketData
    );

    const txFiatValue = currencyTxAmount.amount.toNumber()
      ? formatCurrency(currencyTxAmount)
      : undefined;

    return {
      recipient: cvToString(payload.functionArgs[2]),
      txValue: new BigNumber(txValue).shiftedBy(-decimals).toString(),
      nonce: String(tx.auth.spendingCondition.nonce),
      fee: feeValue,
      totalSpend,
      sendingValue,
      txFiatValue,
      txFiatValueSymbol: tokenMarketData.price.symbol,
      memoDisplayText,
      symbol,
    };
  }

  return {
    formSentSummaryTxState,
    formReviewTxSummary,
  };
}
