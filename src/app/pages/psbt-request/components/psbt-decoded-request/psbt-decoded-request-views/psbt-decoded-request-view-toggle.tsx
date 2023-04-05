import { Flex, Text, color } from '@stacks/ui';

interface PsbtDecodedRequestViewToggleProps {
  onSetShowAdvancedView(): void;
  shouldDefaultToAdvancedView: boolean;
  showAdvancedView: boolean;
}
export function PsbtDecodedRequestViewToggle({
  onSetShowAdvancedView,
  shouldDefaultToAdvancedView,
  showAdvancedView,
}: PsbtDecodedRequestViewToggleProps) {
  return (
    <Flex
      _hover={{ cursor: 'pointer' }}
      justifyContent="flex-end"
      as="button"
      onClick={onSetShowAdvancedView}
      pt="tight"
      px="loose"
      width="100%"
    >
      <Text
        color={color('accent')}
        display={shouldDefaultToAdvancedView ? 'none' : 'block'}
        fontSize={1}
        py="tight"
      >
        {showAdvancedView ? 'Hide advanced view' : 'Show advanced view'}
      </Text>
    </Flex>
  );
}
