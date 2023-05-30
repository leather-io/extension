import { useLocation, useNavigate } from 'react-router-dom';

import get from 'lodash.get';

import { BtcFeeType } from '@shared/models/fees/bitcoin-fees.model';
import { createMoney } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import {
  BitcoinFeesList,
  OnChooseFeeArgs,
} from '@app/components/bitcoin-fees-list/bitcoin-fees-list';
import { BitcoinFeesListLayout } from '@app/components/bitcoin-fees-list/components/bitcoin-fees-list.layout';
import { useBitcoinFeesList } from '@app/components/bitcoin-fees-list/use-bitcoin-fees-list';
import { ModalHeader } from '@app/components/modal-header';
import { useZeroIndexTaprootAddress } from '@app/query/bitcoin/ordinals/use-zero-index-taproot-address';
import { useCurrentAccountIndex } from '@app/store/accounts/account';

import { useSendBrc20State } from '../../family/brc20/components/send-brc20-container';

function useBrc20ChooseFeeState() {
  const location = useLocation();
  return {
    tick: get(location.state, 'tick') as string,
    amount: get(location.state, 'amount') as string,
    recipient: get(location.state, 'recipient') as string,
  };
}

export function BrcChooseFee() {
  const navigate = useNavigate();
  const { amount, recipient, tick } = useBrc20ChooseFeeState();
  const { selectedFeeType, setSelectedFeeType } = useSendBrc20State();
  const currentAccountIndex = useCurrentAccountIndex();
  const btcAddressTaproot = useZeroIndexTaprootAddress(currentAccountIndex);

  const { feesList, isLoading } = useBitcoinFeesList({
    amount: Number(amount),
    recipient,
  });
  const amountAsMoney = createMoney(Number(amount), tick, 0);

  async function previewTransaction({ feeRate, feeValue, time }: OnChooseFeeArgs) {
    navigate(RouteUrls.SendBrc20Confirmation.replace(':ticker', tick), {
      state: {
        fee: feeValue,
        serviceFee: '50',
        recipient,
        tick,
        amount,
        hasHeaderTitle: true,
      },
    });
  }

  useRouteHeader(<ModalHeader defaultGoBack hideActions title="Choose fee" />);

  return (
    <BitcoinFeesListLayout>
      <BitcoinFeesList
        amount={amountAsMoney}
        feesList={feesList}
        isLoading={isLoading}
        onChooseFee={previewTransaction}
        onSetSelectedFeeType={(value: BtcFeeType) => setSelectedFeeType(value)}
        selectedFeeType={selectedFeeType}
      />
    </BitcoinFeesListLayout>
  );
}
