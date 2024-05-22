import { useNavigate, useParams } from 'react-router-dom';

import type { CryptoAssetBalance, MarketData, Sip10CryptoAssetInfo } from '@leather-wallet/models';

import { RouteUrls } from '@shared/route-urls';

import { useToast } from '@app/features/toasts/use-toast';
import { useAlexCurrencyPriceAsMarketData } from '@app/query/common/alex-sdk/alex-sdk.hooks';
import { useSip10Token } from '@app/query/stacks/sip10/sip10-tokens.hooks';

import { Sip10TokenSendFormContainer } from './sip10-token-send-form-container';

interface Sip10TokenSendFormLoaderProps {
  children(token: {
    balance: CryptoAssetBalance;
    info: Sip10CryptoAssetInfo;
    marketData: MarketData;
  }): React.ReactNode;
}
function Sip10TokenSendFormLoader({ children }: Sip10TokenSendFormLoaderProps) {
  const { contractId } = useParams();
  const token = useSip10Token(contractId ?? '');
  const priceAsMarketData = useAlexCurrencyPriceAsMarketData();
  const toast = useToast();
  const navigate = useNavigate();

  if (!contractId) return;

  if (!token) {
    toast.error('Token not found');
    navigate(RouteUrls.SendCryptoAsset);
    return;
  }

  return children({
    ...token,
    marketData: priceAsMarketData(token.info.contractId, token.balance.availableBalance.symbol),
  });
}

export function Sip10TokenSendForm() {
  return (
    <Sip10TokenSendFormLoader>
      {token => (
        <Sip10TokenSendFormContainer
          balance={token.balance}
          info={token.info}
          marketData={token.marketData}
        />
      )}
    </Sip10TokenSendFormLoader>
  );
}
