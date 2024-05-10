import { Navigate, useParams } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useToast } from '@app/features/toasts/use-toast';
import type { Sip10AccountCryptoAssetWithDetails } from '@app/query/models/crypto-asset.model';
import { useSip10CryptoAssetWithDetails } from '@app/query/stacks/sip10/sip10-tokens.hooks';

import { Sip10TokenSendFormContainer } from './sip10-token-send-form-container';

interface Sip10TokenSendFormLoaderProps {
  children(data: { asset: Sip10AccountCryptoAssetWithDetails }): React.ReactNode;
}
function Sip10TokenSendFormLoader({ children }: Sip10TokenSendFormLoaderProps) {
  const { contractId } = useParams();
  const asset = useSip10CryptoAssetWithDetails(contractId ?? '');
  const toast = useToast();

  if (!asset) {
    toast.error('Asset not found');
    return <Navigate to={RouteUrls.SendCryptoAsset} />;
  }

  return children({ asset });
}

export function Sip10TokenSendForm() {
  return (
    <Sip10TokenSendFormLoader>
      {({ asset }) => <Sip10TokenSendFormContainer asset={asset} />}
    </Sip10TokenSendFormLoader>
  );
}
