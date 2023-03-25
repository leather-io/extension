import {
  ContractCallPayload,
  IntCV,
  StacksTransaction,
  TokenTransferPayload,
  addressToString,
  cvToString,
} from '@stacks/transactions';
import { microStxToStx } from '@stacks/ui-utils';
import BigNumber from 'bignumber.js';

import { CryptoCurrencies } from '@shared/models/currencies.model';
import { createMoney } from '@shared/models/money.model';

import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { formatMoney } from '@app/common/money/format-money';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';
import { useStacksBlockTime } from '@app/query/stacks/info/info.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { convertToMoneyTypeWithDefaultOfZero } from '../../../components/confirmation/send-form-confirmation.utils';

export function useStacksTransactionSummary(token: CryptoCurrencies) {
  const tokenMarketData = useCryptoCurrencyMarketData(token);
  const { isTestnet } = useCurrentNetworkState();
  const { data: blockTime } = useStacksBlockTime();

  function formSentSummaryTxState(txId: string, signedTx: StacksTransaction) {
    return {
      state: {
        hasHeaderTitle: true,
        txLink: {
          blockchain: 'stacks',
          txid: txId || '',
        },
        txId,
        ...formReviewTxSummary(signedTx, token),
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
      arrivesIn: getArrivesInTime(),
      symbol: 'STX',
      txValue: microStxToStx(Number(txValue)),
      sendingValue: formatMoney(convertToMoneyTypeWithDefaultOfZero('STX', Number(txValue))),
      txFiatValue: baseCurrencyAmountInQuote(
        createMoney(Number(payload.amount), 'STX'),
        tokenMarketData
      ),
      nonce: String(tx.auth.spendingCondition.nonce),
      memoDisplayText,
    };
  }

  function formSip10TxSummary(tx: StacksTransaction, symbol: string, decimals = 6) {
    const payload = tx.payload as ContractCallPayload;
    const fee = tx.auth.spendingCondition.fee;
    const txValue = Number((payload.functionArgs[0] as IntCV).value);
    const memo = cvToString(payload.functionArgs[3]);
    const memoDisplayText = memo === 'none' ? 'No memo' : memo;

    const sendingValue = formatMoney(
      convertToMoneyTypeWithDefaultOfZero(symbol, txValue, decimals)
    );
    const feeValue = formatMoney(convertToMoneyTypeWithDefaultOfZero('STX', Number(fee)));
    const totalSpend = `${sendingValue} + ${feeValue}`;

    const currencyTxAmount = baseCurrencyAmountInQuote(
      createMoney(txValue, symbol.toUpperCase(), decimals),
      tokenMarketData
    );

    const txFiatValue = currencyTxAmount.amount.toNumber() ? currencyTxAmount : undefined;

    return {
      recipient: cvToString(payload.functionArgs[2]),
      arrivesIn: getArrivesInTime(),
      txValue: new BigNumber(txValue).shiftedBy(-decimals).toString(),
      nonce: String(tx.auth.spendingCondition.nonce),
      fee: feeValue,
      totalSpend,
      sendingValue,
      txFiatValue,
      memoDisplayText,
      symbol,
    };
  }

  function getArrivesInTime() {
    let arrivesIn = isTestnet
      ? blockTime?.testnet.target_block_time
      : blockTime?.mainnet.target_block_time;
    if (!arrivesIn) {
      return '~10 – 20 min';
    }

    arrivesIn = arrivesIn / 60;
    return `~${arrivesIn} min`;
  }

  function removeTrailingNullCharacters(s: string) {
    return s.replace(/\0*$/g, '');
  }

  return {
    formSentSummaryTxState,
    formReviewTxSummary,
  };
}
