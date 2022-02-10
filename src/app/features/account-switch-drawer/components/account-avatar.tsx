import { Suspense, memo } from 'react';
import { Box, BoxProps } from '@stacks/ui';

import { AccountAvatar } from '@app/components/account-avatar/account-avatar';
import { useGetAccountNamesByAddressQuery } from '@app/query/bns/bns.hooks';
import { getAccountDisplayName } from '@app/common/utils/get-account-display-name';
import { usePublicKeyToAddress } from '@app/common/hooks/use-public-key-to-address';

interface AccountAvatarItemProps extends BoxProps {
  publicKey: string;
  index: number;
}
const AccountAvatarSuspense = memo(({ publicKey, index }: AccountAvatarItemProps) => {
  const address = usePublicKeyToAddress(publicKey);
  const name = useGetAccountNamesByAddressQuery(address);
  return <AccountAvatar name={name[0] ?? getAccountDisplayName({ index })} publicKey={publicKey} />;
});

export const AccountAvatarItem = memo(({ publicKey, index, ...rest }: AccountAvatarItemProps) => {
  const defaultName = getAccountDisplayName({ index });
  return (
    <Box {...rest}>
      <Suspense fallback={<AccountAvatar name={defaultName} publicKey={publicKey} />}>
        <AccountAvatarSuspense publicKey={publicKey} index={index} />
      </Suspense>
    </Box>
  );
});
