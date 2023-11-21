import { Flex, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { Tooltip } from '@app/components/tooltip';
import { InfoIcon } from '@app/ui/components/icons/info-icon';
import { Caption } from '@app/ui/components/typography/caption';

interface LedgerScreenDetailProps {
  children: React.ReactNode;
  title: string;
  tooltipLabel?: string;
}
export function LedgerScreenDetail(props: LedgerScreenDetailProps) {
  const { children, title, tooltipLabel } = props;

  return (
    <Flex borderColor="accent.border-default" flexDirection="column">
      <Caption>
        {tooltipLabel ? (
          <Tooltip label={tooltipLabel} placement="top">
            <Flex cursor="question" display="inline-flex">
              {title}
              <InfoIcon
                ml="space.01"
                mt="space.01"
                size="xs"
                style={{ color: token('colors.accent.text-subdued') }}
              />
            </Flex>
          </Tooltip>
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
