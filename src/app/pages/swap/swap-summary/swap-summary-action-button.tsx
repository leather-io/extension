import { Box, Button, Text } from '@stacks/ui';

interface SwapSummaryActionButtonProps {
  icon: React.FC;
  label: string;
  onClick: () => void;
}
export function SwapSummaryActionButton({ icon, label, onClick }: SwapSummaryActionButtonProps) {
  return (
    <Button
      flexGrow={1}
      height="36px"
      onClick={onClick}
      mode="tertiary"
      px="base-tight"
      py="base-loose"
    >
      <Text fontSize="14px" fontWeight={500} mr="tight">
        {label}
      </Text>
      <Box as={icon} size="14px" />
    </Button>
  );
}
