import { useNavigate } from 'react-router-dom';

import { Card } from '@leather-wallet/ui';
import { Box, styled } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { AssetList } from '@app/features/asset-list/asset-list';
import { useConfigBitcoinSendEnabled } from '@app/query/common/remote-config/remote-config.query';

export function ChooseCryptoAsset() {
  const navigate = useNavigate();
  const isBitcoinSendEnabled = useConfigBitcoinSendEnabled();

  function navigateToSendForm(symbol: string, contractId?: string) {
    if (symbol === 'BTC' && !isBitcoinSendEnabled) return navigate(RouteUrls.SendBtcDisabled);
    if (contractId) {
      return navigate(`${RouteUrls.SendCryptoAsset}/${symbol.toLowerCase()}/${contractId}`);
    }
    return navigate(`${RouteUrls.SendCryptoAsset}/${symbol.toLowerCase()}`);
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
        <AssetList onSelectAsset={navigateToSendForm} variant="interactive" />
      </Box>
    </Card>
  );
}
