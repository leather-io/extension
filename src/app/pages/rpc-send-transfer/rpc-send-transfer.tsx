import BigNumber from 'bignumber.js';

import { createMoney } from '@shared/models/money.model';

import { formatMoneyPadded } from '@app/common/money/format-money';
import { InfoCardFooter } from '@app/components/info-card/info-card';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { Button } from '@app/ui/components/button/button';

import { SendTransferDetails } from './components/send-transfer-details';
import { SendTransferHeader } from './components/send-transfer-header';
import { useRpcSendTransfer } from './use-rpc-send-transfer';

export function RpcSendTransfer() {
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const { address, amount, onChooseTransferFee, origin } = useRpcSendTransfer();
  const amountAsMoney = createMoney(new BigNumber(amount), 'BTC');
  const formattedMoney = formatMoneyPadded(amountAsMoney);

  return (
    <>
      <SendTransferHeader amount={formattedMoney} origin={origin} />
      <SendTransferDetails
        address={address}
        amount={formattedMoney}
        currentAddress={nativeSegwitSigner.address}
      />
      <InfoCardFooter>
        <Button borderRadius="sm" flexGrow={1} onClick={onChooseTransferFee}>
          Continue
        </Button>
      </InfoCardFooter>
    </>
  );
}
