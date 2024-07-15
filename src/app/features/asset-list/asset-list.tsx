import { Stack } from 'leather-styles/jsx';

import { BtcAvatarIcon } from '@leather.io/ui';

import type { AssetListVariant, RightElementVariant } from '@app/common/asset-list-utils';
import { useWalletType } from '@app/common/use-wallet-type';
import { BitcoinContractEntryPoint } from '@app/components/bitcoin-contract-entry-point/bitcoin-contract-entry-point';
import { BitcoinNativeSegwitAccountLoader } from '@app/components/loaders/bitcoin-account-loader';
import { BtcAssetItemBalanceLoader } from '@app/components/loaders/btc-balance-loader';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { ConnectLedgerAssetItemFallback } from './_components/connect-ledger-asset-item-fallback';
import { BitcoinStandardsList } from './bitcoin/bitcoin-standards-list/bitcoin-standards-list';
import { BtcCryptoAssetItem } from './bitcoin/btc-crypto-asset-item/btc-crypto-asset-item';
import { StacksAssetsList } from './stacks/stacks-assets-list/stacks-assets-list';

interface AssetListProps {
  onSelectAsset?(symbol: string, contractId?: string): void;
  variant?: AssetListVariant;
  rightElementVariant?: RightElementVariant;
}
export function AssetList({
  onSelectAsset,
  variant = 'read-only',
  rightElementVariant = 'balance',
}: AssetListProps) {
  const network = useCurrentNetwork();
  const { whenWallet } = useWalletType();

  const isReadOnly = variant === 'read-only';

  return (
    <Stack>
      <BitcoinNativeSegwitAccountLoader
        current
        fallback={
          <ConnectLedgerAssetItemFallback
            chain="bitcoin"
            icon={<BtcAvatarIcon />}
            symbol="BTC"
            variant={variant}
          />
        }
      >
        {nativeSegwitAccount => (
          <BtcAssetItemBalanceLoader address={nativeSegwitAccount.address}>
            {(balance, isLoading) => (
              <BtcCryptoAssetItem
                balance={balance}
                isLoading={isLoading}
                onSelectAsset={onSelectAsset}
              />
            )}
          </BtcAssetItemBalanceLoader>
        )}
      </BitcoinNativeSegwitAccountLoader>

      {/* Temporary duplication during Ledger Bitcoin feature dev */}
      {isReadOnly &&
        ['testnet', 'regtest'].includes(network.chain.bitcoin.bitcoinNetwork) &&
        whenWallet({
          software: <BitcoinContractEntryPoint />,
          ledger: null,
        })}

      <StacksAssetsList
        variant={variant}
        onSelectAsset={onSelectAsset}
        filter="supported"
        rightElementVariant={rightElementVariant}
      />

      <BitcoinStandardsList
        variant={variant}
        filter="enabled"
        rightElementVariant={rightElementVariant}
      />
    </Stack>
  );
}
