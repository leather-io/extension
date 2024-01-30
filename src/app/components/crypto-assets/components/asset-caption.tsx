import { Flex, styled } from 'leather-styles/jsx';

interface AssetCaptionProps {
  caption: string;
}
export function AssetCaption({ caption }: AssetCaptionProps) {
  return (
    <Flex flexDirection="row">
      <styled.span textStyle="caption.02">{caption}</styled.span>{' '}
    </Flex>
  );
}
