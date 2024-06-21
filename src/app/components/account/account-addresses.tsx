import { HStack } from 'leather-styles/jsx';

import { BulletSeparator, Caption } from '@leather.io/ui';
import { truncateMiddle } from '@leather.io/utils';

import { BitcoinNativeSegwitAccountLoader } from '../loaders/bitcoin-account-loader';
import { StacksAccountLoader } from '../loaders/stacks-account-loader';

interface AccountAddressesProps {
  index: number;
}
export function AcccountAddresses({ index }: AccountAddressesProps) {
  return (
    <HStack alignItems="center" gap="space.02" whiteSpace="nowrap">
      <BulletSeparator>
        <StacksAccountLoader index={index}>
          {account => <Caption>{truncateMiddle(account.address, 4)}</Caption>}
        </StacksAccountLoader>
        <BitcoinNativeSegwitAccountLoader index={index}>
          {signer => <Caption>{truncateMiddle(signer.address, 5)}</Caption>}
        </BitcoinNativeSegwitAccountLoader>
      </BulletSeparator>
    </HStack>
  );
}
