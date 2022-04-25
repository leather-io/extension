import { truncateMiddle } from '@stacks/ui-utils';
import { cvToString, deserializeCV } from '@stacks/transactions';

import { render, waitFor } from '@testing-library/react';
import { ProviderWithWalletAndRequestToken } from '@tests/state-utils';
import { HEYSTACK_HEY_TX_REQUEST_DECODED } from '@tests/mocks';
import { setupHeystackEnv } from '@tests/mocks/heystack';
import StaticEmotionCacheProvider from '@tests/utils/static-emotion-cache-provider';
import { hexToBuff } from '@app/common/utils';

import { ContractCallDetails } from './contract-call-details';

const truncatedContractAddress = truncateMiddle(HEYSTACK_HEY_TX_REQUEST_DECODED.contractAddress, 4);
const truncatedContractId = `${truncatedContractAddress}.${HEYSTACK_HEY_TX_REQUEST_DECODED.contractName}`;

const getStringValueFromHexCv = (hex: string) => {
  const argCV = deserializeCV(hexToBuff(hex));
  return cvToString(argCV);
};
const message = getStringValueFromHexCv(HEYSTACK_HEY_TX_REQUEST_DECODED.functionArgs[0]);
const giphyUrl = getStringValueFromHexCv(HEYSTACK_HEY_TX_REQUEST_DECODED.functionArgs[1]);

describe('<ContractCallDetails />', () => {
  setupHeystackEnv();
  it('correctly displays the contract address and function name', async () => {
    const { getByText } = render(
      <StaticEmotionCacheProvider>
        <ProviderWithWalletAndRequestToken>
          <ContractCallDetails />
        </ProviderWithWalletAndRequestToken>
      </StaticEmotionCacheProvider>
    );
    await waitFor(() => {
      getByText(HEYSTACK_HEY_TX_REQUEST_DECODED.functionName);
      getByText(truncatedContractId);
    });
  });

  it('correctly displays the function arguments (message and giphy url)', async () => {
    const { getByText } = render(
      <StaticEmotionCacheProvider>
        <ProviderWithWalletAndRequestToken>
          <ContractCallDetails />
        </ProviderWithWalletAndRequestToken>
      </StaticEmotionCacheProvider>
    );
    await waitFor(() => {
      getByText(message);
      getByText(giphyUrl);
    });
  });
});
