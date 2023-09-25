import { Text } from '@stacks/ui';
import { HStack, HstackProps } from 'leather-styles/jsx';

import { isValidUrl } from '@shared/utils/validate-url';

import { StacksAssetAvatar } from '@app/components/crypto-assets/stacks/components/stacks-asset-avatar';

interface TxAssetItemProps extends HstackProps {
  iconString: string;
  amount: string | number;
  ticker: string;
}
export function TxAssetItem(props: TxAssetItemProps) {
  const { iconString, amount, ticker, ...rest } = props;
  const imageCanonicalUri = isValidUrl(iconString) ? iconString : undefined;

  return (
    <HStack alignItems="center" flexGrow={1} justifyContent="space-between" width="100%" {...rest}>
      <HStack>
        <StacksAssetAvatar
          gradientString={iconString}
          imageCanonicalUri={imageCanonicalUri}
          isStx={iconString === 'STX'}
          size="32px"
        />
        <Text fontWeight="500" fontSize={4}>
          {ticker}
        </Text>
      </HStack>
      <Text fontWeight="500" fontSize={4}>
        {amount}
      </Text>
    </HStack>
  );
}
