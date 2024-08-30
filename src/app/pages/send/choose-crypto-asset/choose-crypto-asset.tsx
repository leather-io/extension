import { useNavigate } from 'react-router-dom';

import { Box, styled } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { Card, Content, Page } from '@app/components/layout';
import { AssetList } from '@app/features/asset-list/asset-list';
import { PageHeader } from '@app/features/container/headers/page.header';
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
    <>
      <PageHeader isSettingsVisibleOnSm={false} />
      <Content>
        <Page>
          <Card
            contentStyle={{
              p: 'space.00',
            }}
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
        </Page>
      </Content>
    </>
  );
}
