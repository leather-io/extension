import { Box, Button, Flex, FlexProps, Stack, StackProps, Text } from '@stacks/ui';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';

import { isString } from '@shared/utils';

import { whenPageMode } from '@app/common/utils';
import { figmaTheme } from '@app/common/utils/figma-theme';

import { SpaceBetween } from '../layout/space-between';

// InfoCard
interface InfoCardProps extends FlexProps {
  children: React.ReactNode;
}
export function InfoCard({ children, ...props }: InfoCardProps) {
  return (
    <Flex flexDirection="column" alignItems="center" justifyItems="center" width="100%" {...props}>
      {children}
    </Flex>
  );
}

// InfoCardRow
interface InfoCardRowProps {
  title: string;
  value: React.ReactNode;
  titleAdditionalElement?: React.ReactNode;
}

export function InfoCardRow({ title, value, titleAdditionalElement, ...props }: InfoCardRowProps) {
  return (
    <SpaceBetween fontSize="14px" alignItems="start" {...props}>
      <Flex alignItems="center">
        <Text color={figmaTheme.textSubdued}>{title}</Text>
        {titleAdditionalElement && titleAdditionalElement}
      </Flex>
      {isString(value) ? (
        <Text
          color={figmaTheme.text}
          fontWeight="500"
          data-testid={SharedComponentsSelectors.InfoCardRowValue}
          fontVariant="tabular-nums"
          letterSpacing="-0.01em"
        >
          {value}
        </Text>
      ) : (
        value
      )}
    </SpaceBetween>
  );
}

// InfoCardSeparator
export function InfoCardSeparator() {
  return (
    <Box py="16px">
      <hr />
    </Box>
  );
}

// InfoCardAssetValue
interface InfoCardAssetValueProps extends StackProps {
  value: number;
  fiatValue?: string;
  fiatSymbol?: string;
  symbol?: string;
  icon?: React.FC;
}

export function InfoCardAssetValue({
  value,
  fiatValue,
  fiatSymbol,
  symbol,
  icon,
  ...props
}: InfoCardAssetValueProps) {
  return (
    <Box width="100%" {...props}>
      <Stack
        width="100%"
        alignItems="center"
        backgroundColor="#F9F9FA"
        py="24px"
        border="1px solid #EFEFF2"
        borderRadius="10px"
      >
        {icon && <Box as={icon} size="32px" />}

        <Flex flexDirection="column" alignItems="center">
          <Text
            fontSize="24px"
            fontWeight="500"
            lineHeight="36px"
            data-testid={SharedComponentsSelectors.InfoCardAssetValue}
          >
            {value} {symbol}
          </Text>
          {fiatValue && (
            <Text fontSize="12px" mt="4px">
              ~ {fiatValue} {fiatSymbol}
            </Text>
          )}
        </Flex>
      </Stack>
    </Box>
  );
}

// InfoCardBtn
interface InfoCardBtnProps {
  icon: React.FC;
  label: string;
  onClick: () => void;
}

export function InfoCardBtn({ icon, label, onClick }: InfoCardBtnProps) {
  return (
    <Button
      onClick={onClick}
      mode="tertiary"
      height="36px"
      px="base-tight"
      py="base-loose"
      flexGrow="1"
    >
      <Text fontSize="14px" mr="10px" fontWeight="500">
        {label}
      </Text>
      <Box as={icon} mr="tight" size="14px" />
    </Button>
  );
}

// InfoCardFooter
interface InfoCardFooterProps {
  children: React.ReactNode;
}

export function InfoCardFooter({ children }: InfoCardFooterProps) {
  return (
    <Flex
      bottom="0"
      width="100%"
      bg={whenPageMode({
        full: '',
        popup: '#fff',
      })}
      borderTop="1px solid #EFEFF2"
      alignItems="center"
      justifyContent="center"
      zIndex="999"
      py="loose"
      px="extra-loose"
      position={whenPageMode({
        full: 'unset',
        popup: 'fixed',
      })}
    >
      {children}
    </Flex>
  );
}
