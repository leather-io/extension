import { useNavigate } from 'react-router-dom';

import { Box, styled } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { AssetList } from '@app/features/asset-list/asset-list';
import { useToast } from '@app/features/toasts/use-toast';
import { useConfigBitcoinSendEnabled } from '@app/query/common/remote-config/remote-config.query';
import type { AccountCryptoAssetWithDetails } from '@app/query/models/crypto-asset.model';
import { getSip10InfoFromAsset } from '@app/query/stacks/sip10/sip10-tokens.hooks';
import { Card } from '@app/ui/layout/card/card';
import { getAssetStringParts } from '@app/ui/utils/get-asset-string-parts';

export function ChooseCryptoAsset() {
  const navigate = useNavigate();
  const isBitcoinSendEnabled = useConfigBitcoinSendEnabled();
  const toast = useToast();

  function navigateToSendForm(asset: AccountCryptoAssetWithDetails) {
    switch (asset.type) {
      case 'btc':
        if (!isBitcoinSendEnabled) return navigate(RouteUrls.SendBtcDisabled);
        return navigate(`${RouteUrls.SendCryptoAsset}/${asset.info.symbol.toLowerCase()}`);
      case 'sip-10':
        const info = getSip10InfoFromAsset(asset);
        if (info) {
          const { assetName } = getAssetStringParts(info.contractId);
          const symbol = !info.symbol ? assetName : info.symbol.toLowerCase();
          return navigate(`${RouteUrls.SendCryptoAsset}/${symbol}/${info.contractId}`);
        }
        toast.error('No contract id');
        return navigate('..');
      default:
        return navigate(`${RouteUrls.SendCryptoAsset}/${asset.info.symbol.toLowerCase()}`);
    }
  }

  return (
    <Card
      header={
        <styled.h1 textStyle="heading.03" p="space.05">
          choose asset <br /> to send
        </styled.h1>
      }
    >
      <Box pb="space.04" px="space.05">
        <AssetList onClick={navigateToSendForm} variant="interactive" />
      </Box>
    </Card>
  );
}
