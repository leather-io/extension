import { useNavigate, useParams } from 'react-router-dom';

import type { CryptoAssetBalance, MarketData, Sip10CryptoAssetInfo } from '@leather.io/models';
import { useSip10Token } from '@leather.io/query';

import { RouteUrls } from '@shared/route-urls';

import { useSip10FiatMarketData } from '@app/common/hooks/use-calculate-sip10-fiat-value';
import { Content } from '@app/components/layout';
import { PageHeader } from '@app/features/container/headers/page.header';
import { useToast } from '@app/features/toasts/use-toast';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

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
  const stxAddress = useCurrentStacksAccountAddress();
  const token = useSip10Token(stxAddress, contractId ?? '');
  const { getTokenMarketData } = useSip10FiatMarketData();
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
    marketData: getTokenMarketData(token.info.contractId, token.balance.availableBalance.symbol),
  });
}

export function Sip10TokenSendForm() {
  return (
    <>
      <PageHeader title="Send" />
      <Content>
        <Sip10TokenSendFormLoader>
          {token => (
            <Sip10TokenSendFormContainer
              balance={token.balance}
              info={token.info}
              marketData={token.marketData}
            />
          )}
        </Sip10TokenSendFormLoader>
      </Content>
    </>
  );
}
