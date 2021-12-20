import { useGetContractInterface } from '@app/query/contract/contract.query';
import { TransactionPayload } from '@stacks/connect';
import { renderHook } from '@testing-library/react-hooks';
import { HEYSTACK_HEY_TX_REQUEST_DECODED } from '@tests/mocks';
import { setupHeystackEnv } from '@tests/mocks/heystack';
import { ProviderWithWalletAndRequestToken } from '@tests/state-utils';

describe('useGetContractInterface', () => {
  setupHeystackEnv();
  it('returns a successful query', async () => {
    const { result, waitFor } = renderHook(
      () =>
        useGetContractInterface({
          publicKey: '02c67e6eec3c66368057320e631cff03f1f369228d24379f358a0ae8ff942e4eff',
          contractAddress: HEYSTACK_HEY_TX_REQUEST_DECODED.contractAddress,
          contractName: HEYSTACK_HEY_TX_REQUEST_DECODED.contractName,
        } as TransactionPayload),
      {
        wrapper: ProviderWithWalletAndRequestToken,
      }
    );
    await waitFor(() => result.current.isSuccess);
  });
});
