import { HStack, HstackProps, styled } from 'leather-styles/jsx';

import { isValidUrl } from '@shared/utils/validate-url';

import { StacksAssetAvatar } from '@app/components/stacks-asset-avatar';

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
          img={imageCanonicalUri}
          isStx={iconString === 'STX'}
          size="32"
        />
        <styled.span textStyle="heading.04">{ticker}</styled.span>
      </HStack>
      <styled.span textStyle="heading.04">{amount}</styled.span>
    </HStack>
  );
}
