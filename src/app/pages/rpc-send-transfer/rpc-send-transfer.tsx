import BigNumber from 'bignumber.js';

import { Button } from '@leather.io/ui';
import { createMoney, formatMoneyPadded } from '@leather.io/utils';

import { InfoCardFooter } from '@app/components/info-card/info-card';
import { useBreakOnNonCompliantEntity } from '@app/query/common/compliance-checker/compliance-checker.query';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { SendTransferDetails } from './components/send-transfer-details';
import { SendTransferHeader } from './components/send-transfer-header';
import { useRpcSendTransfer } from './use-rpc-send-transfer';

export function RpcSendTransfer() {
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const { recipients, recipientsAddresses, totalAmount, onChooseTransferFee, origin } =
    useRpcSendTransfer();
  const amountAsMoney = createMoney(new BigNumber(totalAmount), 'BTC');
  const formattedMoney = formatMoneyPadded(amountAsMoney);

  useBreakOnNonCompliantEntity(recipientsAddresses);

  return (
    <>
      <SendTransferHeader amount={formattedMoney} origin={origin} />
      <SendTransferDetails recipients={recipients} currentAddress={nativeSegwitSigner.address} />
      <InfoCardFooter>
        <Button borderRadius="sm" flexGrow={1} onClick={onChooseTransferFee}>
          Continue
        </Button>
      </InfoCardFooter>
    </>
  );
}
