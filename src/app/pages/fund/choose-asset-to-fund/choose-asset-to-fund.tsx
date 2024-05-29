import { useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Card, Page } from '@leather-wallet/ui';
import { Stack, styled } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { BitcoinNativeSegwitAccountLoader } from '@app/components/loaders/bitcoin-account-loader';
import { BtcBalanceLoader } from '@app/components/loaders/btc-balance-loader';
import { CurrentStacksAccountLoader } from '@app/components/loaders/stacks-account-loader';
import { StxBalanceLoader } from '@app/components/loaders/stx-balance-loader';
import { BtcCryptoAssetItem } from '@app/features/asset-list/bitcoin/btc-crypto-asset-item/btc-crypto-asset-item';
import { StxCryptoAssetItem } from '@app/features/asset-list/stacks/stx-crypo-asset-item/stx-crypto-asset-item';

export function ChooseCryptoAssetToFund() {
  const navigate = useNavigate();

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
                <BtcBalanceLoader address={signer.address}>
                  {(balance, isInitialLoading) => (
                    <BtcCryptoAssetItem
                      balance={balance}
                      isLoading={isInitialLoading}
                      onSelectAsset={() => navigateToFund('BTC')}
                    />
                  )}
                </BtcBalanceLoader>
              )}
            </BitcoinNativeSegwitAccountLoader>

            <CurrentStacksAccountLoader>
              {account => (
                <StxBalanceLoader address={account.address}>
                  {(balance, isInitialLoading) => (
                    <StxCryptoAssetItem
                      balance={balance}
                      isLoading={isInitialLoading}
                      onSelectAsset={() => navigateToFund('STX')}
                    />
                  )}
                </StxBalanceLoader>
              )}
            </CurrentStacksAccountLoader>
          </Stack>
        </Card>
      </Page>
      <Outlet />
    </>
  );
}
