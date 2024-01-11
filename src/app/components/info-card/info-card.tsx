import { ReactNode } from 'react';

import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Box, BoxProps, Flex, FlexProps, HStack, Stack, styled } from 'leather-styles/jsx';

import { isString } from '@shared/utils';

import { whenPageMode } from '@app/common/utils';
import { Button } from '@app/ui/components/button/button';
import { DashedHr } from '@app/ui/components/hr';

// InfoCard
interface InfoCardProps extends FlexProps {
  children: ReactNode;
}
export function InfoCard({ children, ...props }: InfoCardProps) {
  return (
    <Flex alignItems="center" flexDirection="column" justifyItems="center" width="100%" {...props}>
      {children}
    </Flex>
  );
}

// InfoCardRow
interface InfoCardRowProps {
  title?: string;
  value: ReactNode;
  titleAdditionalElement?: ReactNode;
}
export function InfoCardRow({ title, value, titleAdditionalElement, ...props }: InfoCardRowProps) {
  return (
    <HStack alignItems="start" fontSize="14px" justifyContent="space-between" {...props}>
      <Flex alignItems="center" gap="space.01">
        <styled.span color="accent.text-subdued" mr="space.01" textStyle="body.02">
          {title}
        </styled.span>
        {titleAdditionalElement && titleAdditionalElement}
      </Flex>
      {isString(value) ? (
        <styled.span
          color="accent.text-primary"
          textStyle="label.02"
          fontVariant="tabular-nums"
          data-testid={SharedComponentsSelectors.InfoCardRowValue}
        >
          {value}
        </styled.span>
      ) : (
        value
      )}
    </HStack>
  );
}

// InfoCardSeparator
export function InfoCardSeparator() {
  return <DashedHr my="space.04" />;
}

// InfoCardAssetValue
interface InfoCardAssetValueProps extends BoxProps {
  value: number;
  fiatValue?: string;
  fiatSymbol?: string;
  symbol?: string;
  icon?: ReactNode;
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
      <Stack alignItems="center" width="100%" py="space.05">
        {icon && icon}

        <Flex alignItems="center" flexDirection="column">
          <styled.h1
            data-testid={SharedComponentsSelectors.InfoCardAssetValue}
            mb="space.01"
            textStyle="heading.03"
          >
            {value} {symbol}
          </styled.h1>
          {fiatValue && (
            <styled.span textStyle="label.01">
              ~ {fiatValue} {fiatSymbol}
            </styled.span>
          )}
        </Flex>
      </Stack>
    </Box>
  );
}

// InfoCardBtn
interface InfoCardBtnProps {
  icon: ReactNode;
  label: string;
  onClick(): void;
}
export function InfoCardBtn({ icon, label, onClick }: InfoCardBtnProps) {
  return (
    <Button onClick={onClick} flexGrow="1">
      <Flex alignItems="center" justifyContent="center">
        <styled.span mx="space.02" textStyle="label.02">
          {label}
        </styled.span>
        {icon}
      </Flex>
    </Button>
  );
}

// InfoCardFooter
interface InfoCardFooterProps {
  children: ReactNode;
}
export function InfoCardFooter({ children }: InfoCardFooterProps) {
  return (
    <Flex
      alignItems="center"
      bg={whenPageMode({
        full: '',
        popup: 'accent.background-primary',
      })}
      bottom="0"
      justifyContent="center"
      p="space.05"
      position={whenPageMode({
        full: 'unset',
        popup: 'fixed',
      })}
      width="100%"
      zIndex="999"
    >
      {children}
    </Flex>
  );
}
