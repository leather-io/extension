import BigNumber from 'bignumber.js';
import { HStack, Stack, styled } from 'leather-styles/jsx';

import {
  AddressDisplayer,
  AnimalSnailIcon,
  Approver,
  Button,
  ItemLayout,
  Pressable,
  QuestionCircleIcon,
} from '@leather.io/ui';
import { createMoney, formatMoneyPadded } from '@leather.io/utils';

import { useSwitchAccountSheet } from '@app/common/switch-account/use-switch-account-sheet-context';
import { ApproverIconWrapper, FeeItemIcon } from '@app/components/fees/fees';
import { RpcApproverSwitchAccount } from '@app/components/rpc/rpc-approver-switch-account';
import { useBreakOnNonCompliantEntity } from '@app/query/common/compliance-checker/compliance-checker.query';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

import { RpcSendTransferWrapper, useRpcSendTransferState } from './rpc-send-transfer-container';
import { useRpcSendTransfer } from './use-rpc-send-transfer';

export function RpcSendTransfer() {
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const { selectedFeeData, recipientsAddresses, totalAmount, onChooseTransferFee, origin } =
    useRpcSendTransferState();
  const amountAsMoney = createMoney(new BigNumber(totalAmount), 'BTC');
  const formattedMoney = formatMoneyPadded(amountAsMoney);
  const { isShowingSwitchAccount } = useSwitchAccountSheet();

  useBreakOnNonCompliantEntity(recipientsAddresses);
  console.log('isShowingSwitchAccount', isShowingSwitchAccount);
  const chosenFee = {
    feeType: 'slow',
    titleLeft: 'Slow',
    captionLeft: '~20 minutes',
    titleRight: '50 BTC',
    captionRight: '',
  };

  function onCancel() {
    //
  }

  return (
    <RpcSendTransferWrapper>
      <Approver requester={origin} width="100%" mt="space.01">
        <Approver.Header
          title="Send BTC"
          info={
            <styled.a
              display="block"
              p="space.01"
              target="_blank"
              href="https://leather.io/guides/connect-dapps"
            >
              <QuestionCircleIcon variant="small" />
            </styled.a>
          }
          onPressRequestedByLink={e => {
            e.preventDefault();
            // onClickRequestedByLink();
          }}
        />

        <RpcApproverSwitchAccount />

        <Approver.Section>
          <Approver.Subheader>Fee</Approver.Subheader>
          <Pressable onClick={onChooseTransferFee} mb="space.02">
            <ItemLayout
              img={<FeeItemIcon feeType={selectedFeeData.feeType} />}
              titleLeft={selectedFeeData.titleLeft}
              captionLeft={selectedFeeData.captionLeft}
              titleRight={selectedFeeData.titleRight}
              captionRight={selectedFeeData.captionRight}
            />
          </Pressable>
        </Approver.Section>

        {/* <SendTransferDetails recipients={recipients} currentAddress={nativeSegwitSigner.address} />
        <InfoCardFooter>
          <Button borderRadius="sm" flexGrow={1} onClick={onChooseTransferFee}>
            Continue
          </Button>
        </InfoCardFooter> */}

        <Approver.Section>
          <Approver.Subheader>
            <styled.span textStyle="label.01">You'll send</styled.span>
          </Approver.Subheader>
        </Approver.Section>

        <Approver.Section>
          <Approver.Subheader>
            <styled.span textStyle="label.01">
              {recipientsAddresses.length > 1 ? 'To addresses' : 'To address'}
            </styled.span>
          </Approver.Subheader>

          <Stack gap="space.03">
            {recipientsAddresses.map(address => (
              <HStack key={address} alignItems="center" gap="space.04">
                <ApproverIconWrapper>
                  <AnimalSnailIcon variant="small" />
                </ApproverIconWrapper>
                <AddressDisplayer address={address} />
              </HStack>
            ))}
          </Stack>
        </Approver.Section>

        <Approver.Actions
          actions={[
            <Button key="cancel" onClick={onCancel} fullWidth variant="outline">
              Cancel
            </Button>,
            <Button key="approve" fullWidth>
              Approve
            </Button>,
          ]}
        >
          <HStack justify="space-between" mb="space.03">
            <styled.span textStyle="label.02">Total spend</styled.span>
            <styled.span textStyle="label.02">{formattedMoney}</styled.span>
          </HStack>
        </Approver.Actions>
      </Approver>
    </RpcSendTransferWrapper>
  );
}
