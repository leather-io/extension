import { Navigate, useParams } from 'react-router-dom';

import type { CryptoAssetBalance, MarketData, Sip10CryptoAssetInfo } from '@leather-wallet/models';

import { RouteUrls } from '@shared/route-urls';

import { useToast } from '@app/features/toasts/use-toast';
import { useSip10Token } from '@app/query/stacks/sip10/sip10-tokens.hooks';

import { Sip10TokenSendFormContainer } from './sip10-token-send-form-container';

interface Sip10TokenSendFormLoaderProps {
  children(token: {
    assetInfo: Sip10CryptoAssetInfo;
    balance: CryptoAssetBalance;
    marketData: MarketData;
  }): React.ReactNode;
}
function Sip10TokenSendFormLoader({ children }: Sip10TokenSendFormLoaderProps) {
  const { contractId } = useParams();
  const token = useSip10Token(contractId ?? '');
  const toast = useToast();

  if (!token) {
    toast.error('Token not found');
    return <Navigate to={RouteUrls.SendCryptoAsset} />;
  }

  return children(token);
}

export function Sip10TokenSendForm() {
  return (
    <Sip10TokenSendFormLoader>
      {token => (
        <Sip10TokenSendFormContainer
          assetInfo={token.assetInfo}
          balance={token.balance}
          marketData={token.marketData}
        />
      )}
    </Sip10TokenSendFormLoader>
  );
}
