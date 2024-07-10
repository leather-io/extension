import { useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Stack, styled } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { useUpdatePageHeaderContext } from '@app/common/page/page.context';
import { BitcoinNativeSegwitAccountLoader } from '@app/components/loaders/bitcoin-account-loader';
import { BtcAssetItemBalanceLoader } from '@app/components/loaders/btc-balance-loader';
import { CurrentStacksAccountLoader } from '@app/components/loaders/stacks-account-loader';
import { StxAssetItemBalanceLoader } from '@app/components/loaders/stx-balance-loader';
import { BtcCryptoAssetItem } from '@app/features/asset-list/bitcoin/btc-crypto-asset-item/btc-crypto-asset-item';
import { StxCryptoAssetItem } from '@app/features/asset-list/stacks/stx-crypo-asset-item/stx-crypto-asset-item';
import { Card } from '@app/ui/layout/card/card';
import { Page } from '@app/ui/layout/page/page.layout';

export function ChooseCryptoAssetToFund() {
  const navigate = useNavigate();
  useUpdatePageHeaderContext({ isSettingsVisibleOnSm: false, onBackLocation: RouteUrls.Home });

  const navigateToFund = useCallback(
    (symbol: string) => navigate(RouteUrls.Fund.replace(':currency', symbol)),
    [navigate]
  );

  return (
    <>
      <Page>
        <Card
          header={
            <styled.h1 textStyle="heading.03" p="space.05">
              choose asset <br /> to fund
            </styled.h1>
          }
        >
          <Stack pb="space.04" px="space.05">
            <BitcoinNativeSegwitAccountLoader current>
              {signer => (
                <BtcAssetItemBalanceLoader address={signer.address}>
                  {(balance, isLoading) => (
                    <BtcCryptoAssetItem
                      balance={balance}
                      isLoading={isLoading}
                      onSelectAsset={() => navigateToFund('BTC')}
                    />
                  )}
                </BtcAssetItemBalanceLoader>
              )}
            </BitcoinNativeSegwitAccountLoader>

            <CurrentStacksAccountLoader>
              {account => (
                <StxAssetItemBalanceLoader address={account.address}>
                  {(balance, isLoading) => (
                    <StxCryptoAssetItem
                      balance={balance}
                      isLoading={isLoading}
                      onSelectAsset={() => navigateToFund('STX')}
                    />
                  )}
                </StxAssetItemBalanceLoader>
              )}
            </CurrentStacksAccountLoader>
          </Stack>
        </Card>
      </Page>
      <Outlet />
    </>
  );
}
