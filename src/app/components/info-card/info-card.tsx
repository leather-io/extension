import { Box, Button, Flex, FlexProps, Stack, Text } from '@stacks/ui';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';

import { isString } from '@shared/utils';

import { figmaTheme } from '@app/common/utils/figma-theme';

import { SpaceBetween } from '../layout/space-between';

// InfoCard
interface InfoCardProps extends FlexProps {
  children: React.ReactNode;
}
export function InfoCard({ children, ...props }: InfoCardProps) {
  return (
    <Flex flexDirection="column" alignItems="center" justifyItems="centers" width="100%" {...props}>
      {children}
    </Flex>
  );
}

// InfoCardRow
interface InfoCardRowProps {
  title: string;
  value: React.ReactNode;
}

export function InfoCardRow({ title, value, ...props }: InfoCardRowProps) {
  return (
    <SpaceBetween fontSize="14px" alignItems="start" {...props}>
      <Text color={figmaTheme.textSubdued}>{title}</Text>
      {isString(value) ? (
        <Text
          color={figmaTheme.text}
          fontWeight="500"
          data-testid={SharedComponentsSelectors.InfoCardRowValue}
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
interface InfoCardAssetValueProps {
  value: number;
  fiatValue?: string;
  fiatSymbol?: string;
  symbol: string;
  icon?: React.FC;
}

export function InfoCardAssetValue({
  value,
  fiatValue,
  fiatSymbol,
  symbol,
  icon,
}: InfoCardAssetValueProps) {
  return (
    <Stack
      mb="44px"
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
