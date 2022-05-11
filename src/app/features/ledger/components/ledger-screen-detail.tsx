import { FiInfo } from 'react-icons/fi';
import { color, Box, Flex, Text } from '@stacks/ui';
import { Caption } from '@app/components/typography';
import { Tooltip } from '@app/components/tooltip';

interface LedgerScreenDetailProps {
  children: React.ReactNode;
  isFullPage: boolean;
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
              <Box
                as={FiInfo}
                color={color('text-caption')}
                ml="extra-tight"
                size="14px"
                mt="3px"
              />
            </Flex>
          </Tooltip>
        ) : (
          <>{title}</>
        )}
      </Caption>
      <Flex alignItems="center" mt="base">
        <Text overflowWrap="break-word" maxWidth={['280px', '360px']}>
          {children}
        </Text>
      </Flex>
    </Flex>
  );
}
