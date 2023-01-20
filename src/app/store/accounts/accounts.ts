import { createStacksPublicKey, pubKeyfromPrivKey, publicKeyToAddress } from '@stacks/transactions';
import { atom } from 'jotai';

import { derivePublicKey } from '@app/common/derive-public-key';
import { addressNetworkVersionState } from '@app/store/transactions/transaction';
import { selectLedgerKey, softwareStacksWalletState } from '@app/store/wallet/wallet';

import { storeAtom } from '..';
import { HardwareWalletAccount, SoftwareWalletAccount, WalletAccount } from './account.models';

const softwareAccountsState = atom<SoftwareWalletAccount[] | undefined>(get => {
  const wallet = get(softwareStacksWalletState);
  const addressVersion = get(addressNetworkVersionState);
  if (!wallet) return undefined;
  return wallet.accounts.map(account => {
    const address = publicKeyToAddress(addressVersion, pubKeyfromPrivKey(account.stxPrivateKey));
    const stxPublicKey = derivePublicKey(account.stxPrivateKey);
    const dataPublicKey = derivePublicKey(account.dataPrivateKey);
    return { ...account, type: 'software', address, stxPublicKey, dataPublicKey };
  });
});

const ledgerAccountsState = atom<HardwareWalletAccount[] | undefined>(get => {
  const ledgerWallet = selectLedgerKey(get(storeAtom));
  const addressVersion = get(addressNetworkVersionState);
  if (!ledgerWallet) return undefined;
  return ledgerWallet.publicKeys.map((publicKeys, index) => {
    const address = publicKeyToAddress(
      addressVersion,
      createStacksPublicKey(publicKeys.stxPublicKey)
    );
    return {
      type: 'ledger',
      address,
      stxPublicKey: publicKeys.stxPublicKey,
      dataPublicKey: publicKeys.dataPublicKey,
      index,
    };
  });
});

export const accountsWithAddressState = atom<WalletAccount[] | undefined>(get => {
  const ledgerAccounts = get(ledgerAccountsState);
  const softwareAccounts = get(softwareAccountsState);
  return ledgerAccounts ? ledgerAccounts : softwareAccounts;
});

// This is only used when there is a pending transaction request and
// the user switches accounts during the signing process
export const hasSwitchedAccountsState = atom<boolean>(false);

export const hasCreatedAccountState = atom<boolean>(false);
