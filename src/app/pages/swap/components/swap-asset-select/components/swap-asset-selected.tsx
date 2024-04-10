import { Box, HStack, styled } from 'leather-styles/jsx';

interface SwapAssetSelectedProps {
  contentLeft: React.JSX.Element;
  contentRight: React.JSX.Element;
  name: string;
  showError?: boolean;
}
export function SwapAssetSelected({
  contentLeft,
  contentRight,
  name,
  showError,
}: SwapAssetSelectedProps) {
  return (
    <styled.label
      _focusWithin={{ border: 'action' }}
      alignItems="center"
      border={showError ? 'error' : 'default'}
      borderRadius="sm"
      display="flex"
      height="76px"
      htmlFor={name}
      mb="space.02"
      minHeight="64px"
      px="space.04"
      width="100%"
    >
      <Box width="100%">
        <HStack alignItems="center" justifyContent="space-between">
          {contentLeft}
          {contentRight}
        </HStack>
      </Box>
    </styled.label>
  );
}
