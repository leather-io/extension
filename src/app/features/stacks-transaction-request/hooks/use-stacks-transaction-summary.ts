import { bytesToUtf8 } from '@stacks/common';
import {
  ClarityType,
  ContractCallPayload,
  IntCV,
  StacksTransaction,
  TokenTransferPayload,
  addressToString,
  cvToString,
  serializeCV,
} from '@stacks/transactions';
import BigNumber from 'bignumber.js';

import { CryptoCurrencies } from '@shared/models/currencies.model';
import { createMoney } from '@shared/models/money.model';

import {
  baseCurrencyAmountInQuote,
  convertToMoneyTypeWithDefaultOfZero,
} from '@app/common/money/calculate-money';
import { formatMoney, i18nFormatCurrency } from '@app/common/money/format-money';
import { getEstimatedConfirmationTime } from '@app/common/transactions/stacks/transaction.utils';
import { removeTrailingNullCharacters } from '@app/common/utils';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';
import { useStacksBlockTime } from '@app/query/stacks/info/info.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';
import { microStxToStx } from '@app/ui/utils/micro-stx-to-stx';

export function useStacksTransactionSummary(token: CryptoCurrencies) {
  const tokenMarketData = useCryptoCurrencyMarketData(token);
  const { isTestnet } = useCurrentNetworkState();
  const { data: blockTime } = useStacksBlockTime();

  function formSentSummaryTxState(txId: string, signedTx: StacksTransaction, decimals?: number) {
    return {
      state: {
        hasHeaderTitle: true,
        txLink: {
          blockchain: 'stacks',
          txid: txId || '',
        },
        txId,
        ...formReviewTxSummary(signedTx, token, decimals),
      },
    };
  }

  function formReviewTxSummary(tx: StacksTransaction, symbol = 'STX', decimals = 6) {
    if (symbol !== 'STX') {
      return formSip10TxSummary(tx, symbol, decimals);
    }

    const payload = tx.payload as TokenTransferPayload;
    const txValue = payload.amount;
    const fee = tx.auth.spendingCondition.fee;
    const memoContent = payload?.memo?.content ?? '';
    const memoDisplayText = removeTrailingNullCharacters(memoContent) || 'No memo';

    return {
      recipient: addressToString(payload.recipient.address),
      fee: formatMoney(convertToMoneyTypeWithDefaultOfZero('STX', Number(fee))),
      totalSpend: formatMoney(convertToMoneyTypeWithDefaultOfZero('STX', Number(txValue + fee))),
      arrivesIn: getEstimatedConfirmationTime(isTestnet, blockTime),
      symbol: 'STX',
      txValue: microStxToStx(Number(txValue)),
      sendingValue: formatMoney(convertToMoneyTypeWithDefaultOfZero('STX', Number(txValue))),
      txFiatValue: i18nFormatCurrency(
        baseCurrencyAmountInQuote(createMoney(Number(payload.amount), 'STX'), tokenMarketData)
      ),
      txFiatValueSymbol: tokenMarketData.price.symbol,
      nonce: String(tx.auth.spendingCondition.nonce),
      memoDisplayText,
    };
  }

  function formSip10TxSummary(tx: StacksTransaction, symbol: string, decimals = 6) {
    const payload = tx.payload as ContractCallPayload;
    const fee = tx.auth.spendingCondition.fee;
    const txValue = Number((payload.functionArgs[0] as IntCV).value);
    const isSome = payload.functionArgs[3].type === ClarityType.OptionalSome;
    const memo = bytesToUtf8(serializeCV(payload.functionArgs[3]));
    const memoDisplayText = isSome ? memo : 'No memo';

    const sendingValue = formatMoney(
      convertToMoneyTypeWithDefaultOfZero(symbol, txValue, decimals)
    );
    const feeValue = formatMoney(convertToMoneyTypeWithDefaultOfZero('STX', Number(fee)));
    const totalSpend = `${sendingValue} + ${feeValue}`;

    const currencyTxAmount = baseCurrencyAmountInQuote(
      createMoney(txValue, symbol.toUpperCase(), decimals),
      tokenMarketData
    );

    const txFiatValue = currencyTxAmount.amount.toNumber()
      ? i18nFormatCurrency(currencyTxAmount)
      : undefined;

    return {
      recipient: cvToString(payload.functionArgs[2]),
      arrivesIn: getEstimatedConfirmationTime(isTestnet, blockTime),
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
