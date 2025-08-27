import { useNavigate, useParams } from 'react-router';

import type { CryptoAssetBalance, MarketData, Sip10Asset } from '@leather.io/models';

import { RouteUrls } from '@shared/route-urls';

import { Content } from '@app/components/layout';
import { PageHeader } from '@app/features/container/headers/page.header';
import { useToast } from '@app/features/toasts/use-toast';
import { useMarketData } from '@app/query/common/market-data/market-data.query';
import { useSip10TokenBalance } from '@app/query/stacks/sip10/sip10-balance.hooks';
import { useCurrentAccountIndex } from '@app/store/accounts/account';

import { Sip10TokenSendFormContainer } from './sip10-token-send-form-container';

interface Sip10TokenSendFormLoaderProps {
  children(balance: {
    asset: Sip10Asset;
    balance: CryptoAssetBalance;
    marketData?: MarketData;
  }): React.ReactNode;
}
function Sip10TokenSendFormLoader({ children }: Sip10TokenSendFormLoaderProps) {
  const { contractId } = useParams();
  const accountIndex = useCurrentAccountIndex();
  const tokenBalance = useSip10TokenBalance(accountIndex, contractId ?? '');
  const marketData = useMarketData(tokenBalance!.asset);
  const toast = useToast();
  const navigate = useNavigate();

  if (!contractId) return null;

  if (!tokenBalance) {
    toast.error('Token not found');
    navigate(RouteUrls.SendCryptoAsset);
    return null;
  }

  return children({
    asset: tokenBalance.asset,
    balance: tokenBalance.crypto,
    marketData: marketData.value?.price.amount.isGreaterThan(0) ? marketData.value : undefined,
  });
}

export function Sip10TokenSendForm() {
  return (
    <>
      <PageHeader title="Send" />
      <Content>
        <Sip10TokenSendFormLoader>
          {({ asset, balance, marketData }) => (
            <Sip10TokenSendFormContainer asset={asset} balance={balance} marketData={marketData} />
          )}
        </Sip10TokenSendFormLoader>
      </Content>
    </>
  );
}
