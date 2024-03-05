import { Navigate, useParams } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useToast } from '@app/features/toasts/use-toast';

import { Sip10TokenSendFormContainer } from './sip10-token-send-form-container';

export function Sip10TokenSendForm() {
  return (
    <Sip10TokenSendFormLoader>
      {({ contractId, symbol }) => (
        <Sip10TokenSendFormContainer symbol={symbol} contractId={contractId} />
      )}
    </Sip10TokenSendFormLoader>
  );
}

interface Sip10TokenSendFormLoaderProps {
  children(data: { symbol: string; contractId: string }): React.JSX.Element;
}
function Sip10TokenSendFormLoader({ children }: Sip10TokenSendFormLoaderProps) {
  const { symbol, contractId } = useParams();
  const toast = useToast();

  if (!symbol || !contractId) {
    toast.error('Symbol or contract id not found');
    return <Navigate to={RouteUrls.SendCryptoAsset} />;
  }

  return children({ symbol, contractId });
}
