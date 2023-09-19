import { Box, Flex, styled } from 'leather-styles/jsx';

import { LeatherButton } from '@app/components/button/button';

interface SwapSummaryActionButtonProps {
  icon: React.JSX.Element;
  label: string;
  onClick: () => void;
}
export function SwapSummaryActionButton({ icon, label, onClick }: SwapSummaryActionButtonProps) {
  return (
    <LeatherButton onClick={onClick} width="50%">
      <Flex alignItems="center" justifyContent="center">
        <styled.span mr="space.02" textStyle="label.02">
          {label}
        </styled.span>
        <Box mr="space.01">{icon}</Box>
      </Flex>
    </LeatherButton>
  );
}
