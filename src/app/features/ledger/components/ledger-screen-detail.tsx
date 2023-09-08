import { FiInfo } from 'react-icons/fi';

import { Flex, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { Tooltip } from '@app/components/tooltip';
import { Caption } from '@app/components/typography';

interface LedgerScreenDetailProps {
  children: React.ReactNode;
  title: string;
  tooltipLabel?: string;
}
export function LedgerScreenDetail(props: LedgerScreenDetailProps) {
  const { children, title, tooltipLabel } = props;

  return (
    <Flex borderColor="#DCDDE2" flexDirection="column">
      <Caption>
        {tooltipLabel ? (
          <Tooltip label={tooltipLabel} placement="top">
            <Flex display="inline-flex" cursor="question">
              {title}
              <FiInfo
                color={token('colors.accent.text-subdued')}
                style={{ marginLeft: 'space.01', marginTop: '3px' }}
                size="14px"
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
