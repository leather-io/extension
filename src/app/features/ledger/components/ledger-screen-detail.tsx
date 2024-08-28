import { Box, Flex, styled } from 'leather-styles/jsx';

import { Caption, InfoCircleIcon } from '@leather.io/ui';

import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

interface LedgerScreenDetailProps {
  children: React.ReactNode;
  title: string;
  tooltipLabel?: string;
}
export function LedgerScreenDetail(props: LedgerScreenDetailProps) {
  const { children, title, tooltipLabel } = props;

  return (
    <Flex borderColor="ink.border-default" flexDirection="column">
      <Caption>
        {tooltipLabel ? (
          <BasicTooltip label={tooltipLabel} side="top">
            <Flex cursor="question" display="inline-flex">
              {title}
              <Box ml="space.01" mt="space.01">
                <InfoCircleIcon color="ink.text-subdued" variant="small" />
              </Box>
            </Flex>
          </BasicTooltip>
        ) : (
          <>{title}</>
        )}
      </Caption>
      <Flex alignItems="center" mt="space.04">
        <styled.span overflowWrap="break-word" width="100%">
          {children}
        </styled.span>
      </Flex>
    </Flex>
  );
}
