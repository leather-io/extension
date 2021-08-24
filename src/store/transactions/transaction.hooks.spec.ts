import { act, renderHook } from '@testing-library/react-hooks';
import {
  ContractCallPayload,
  parsePrincipalString,
  PayloadType,
  StacksTransaction,
  TokenTransferPayload,
} from '@stacks/transactions';
import { setupHeystackEnv } from '@tests/mocks/heystack';
import { ProviderWithWalletAndRequestToken } from '@tests/state-utils';
import { stxToMicroStx } from '@common/stacks-utils';
import { useMakeAssetTransfer, useMakeStxTransfer } from './transaction.hooks';
import { HEYSTACK_HEY_TX_REQUEST_DECODED } from '@tests/mocks';

describe(useMakeStxTransfer.name, () => {
  const MEMO = 'hello world';
  const AMOUNT = 25; // STX
  const RECIPIENT = 'ST21FTC82CCKE0YH9SK5SJ1D4XEMRA069FKV0VJ8N';
  const EXPECTED_FEE = 180;
  const EXPECTED_AMOUNT_IN_USTX = stxToMicroStx(AMOUNT).toNumber();
  const EXPECTED_RECIPIENT = parsePrincipalString(RECIPIENT).address;
  setupHeystackEnv();
  it('correctly generates signed transaction for a token transfer', async () => {
    const { result } = renderHook(() => useMakeStxTransfer(), {
      wrapper: ProviderWithWalletAndRequestToken,
    });
    let response: StacksTransaction | undefined;
    await act(async () => {
      response = await result.current({
        memo: MEMO,
        amount: AMOUNT,
        recipient: RECIPIENT,
      });
    });

    expect(response).toBeTruthy();
    expect(response?.payload.payloadType).toEqual(PayloadType.TokenTransfer);
    expect(response?.auth.spendingCondition?.fee.toNumber()).toEqual(EXPECTED_FEE);

    const payload = response?.payload as TokenTransferPayload;

    expect(payload.amount.toNumber()).toEqual(EXPECTED_AMOUNT_IN_USTX);
    expect(payload.recipient.address).toEqual(EXPECTED_RECIPIENT);
    expect(payload.memo.content).toEqual(MEMO);
  });
});

describe(useMakeAssetTransfer.name, () => {
  const MEMO = 'hello world';
  const AMOUNT = 25;
  const RECIPIENT = 'ST21FTC82CCKE0YH9SK5SJ1D4XEMRA069FKV0VJ8N';
  const FUNCTION_NAME = 'transfer';
  const EXPECTED_FEE = 311;
  const EXPECTED_FUNCTION_ARG_LENGTH = 4;
  setupHeystackEnv();
  it('correctly generates signed transaction for heystack transfer', async () => {
    const { result } = renderHook(() => useMakeAssetTransfer(), {
      wrapper: ProviderWithWalletAndRequestToken,
    });
    let response: StacksTransaction | undefined;
    await act(async () => {
      response = await result.current({
        memo: MEMO,
        amount: AMOUNT,
        recipient: RECIPIENT,
      });
    });

    const amount = (response?.payload as ContractCallPayload).functionArgs[0] as any;
    const sender = (response?.payload as ContractCallPayload).functionArgs[1] as any;
    const recipient = (response?.payload as ContractCallPayload).functionArgs[2] as any;
    const memo = (response?.payload as ContractCallPayload).functionArgs[3] as any;

    expect(response).toBeTruthy();
    expect(response?.payload.payloadType).toEqual(PayloadType.ContractCall);
    expect((response?.payload as ContractCallPayload).functionName.content).toEqual(FUNCTION_NAME);
    expect(response?.auth.spendingCondition?.fee.toNumber()).toEqual(EXPECTED_FEE);
    expect((response?.payload as ContractCallPayload).functionArgs.length).toEqual(
      EXPECTED_FUNCTION_ARG_LENGTH
    );
    expect(amount.value.toNumber()).toEqual(AMOUNT);
    expect(sender.address).toEqual(
      parsePrincipalString(HEYSTACK_HEY_TX_REQUEST_DECODED.stxAddress).address
    );
    expect(recipient.address).toEqual(parsePrincipalString(RECIPIENT).address);
    expect(memo.value.buffer.toString('utf-8')).toEqual(MEMO);
  });
});
