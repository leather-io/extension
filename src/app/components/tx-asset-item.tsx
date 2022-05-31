import { Stack, StackProps, Text } from '@stacks/ui';

import { AssetAvatar } from '@app/components/stx-avatar';
import { SpaceBetween } from '@app/components/space-between';
import { isIconUrl } from '@app/common/token-utils';

interface AssetItemProps extends StackProps {
  iconString: string;
  amount: string | number;
  ticker: string;
}

export function TxAssetItem(props: AssetItemProps): JSX.Element {
  const { iconString, amount, ticker, ...rest } = props;
  const imageCanonicalUri = isIconUrl(iconString) ? iconString : undefined;

  return (
    <SpaceBetween alignItems="center" flexGrow={1} width="100%" {...rest}>
      <Stack isInline>
        <AssetAvatar
          size="32px"
          useStx={iconString === 'STX'}
          gradientString={iconString}
          imageCanonicalUri={imageCanonicalUri}
        />
        <Text fontWeight="500" fontSize={4}>
          {ticker}
        </Text>
      </Stack>
      <Text fontWeight="500" fontSize={4}>
        {amount}
      </Text>
    </SpaceBetween>
  );
}
