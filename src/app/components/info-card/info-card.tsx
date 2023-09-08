import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Box, Flex, FlexProps, Stack, StackProps } from 'leather-styles/jsx';
import { styled } from 'leather-styles/jsx';

import { isString } from '@shared/utils';

import { whenPageMode } from '@app/common/utils';

import { LeatherButton } from '../button/button';
import { DashedHr } from '../hr';
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
  title?: string;
  value: React.ReactNode;
  titleAdditionalElement?: React.ReactNode;
}

export function InfoCardRow({ title, value, titleAdditionalElement, ...props }: InfoCardRowProps) {
  return (
    <SpaceBetween fontSize="14px" alignItems="start" {...props}>
      <Flex alignItems="center">
        <styled.span textStyle="body.02" color="accent.text-subdued">
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
    </SpaceBetween>
  );
}

// InfoCardSeparator
export function InfoCardSeparator() {
  return <DashedHr my="space.04" />;
}

// InfoCardAssetValue
interface InfoCardAssetValueProps extends StackProps {
  value: number;
  fiatValue?: string;
  fiatSymbol?: string;
  symbol?: string;
  icon?: React.JSX.Element;
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
    // #4164 FIXME refactor this Box. Passing these props directly to keep TS happy
    <Box width="100%" mb={props.mb} mt={props.mt} my={props.my} px={props.px}>
      <Stack width="100%" alignItems="center" py="24px">
        {icon && icon}
        <Flex flexDirection="column" alignItems="center">
          <styled.h1
            data-testid={SharedComponentsSelectors.InfoCardAssetValue}
            textStyle="heading.03"
            mb="space.01"
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
  icon: React.JSX.Element;
  label: string;
  onClick: () => void;
}

export function InfoCardBtn({ icon, label, onClick }: InfoCardBtnProps) {
  return (
    <LeatherButton onClick={onClick} flexGrow="1">
      <Flex alignItems="center" justifyContent="center">
        <styled.span mr="space.02" textStyle="label.02">
          {label}
        </styled.span>
        {/* // #4164 FIXME check and refactor this */}
        <Box mr="space.02" width="14px" height="14px">
          {icon}
        </Box>
      </Flex>
    </LeatherButton>
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
      alignItems="center"
      justifyContent="center"
      zIndex="999"
      p="space.05"
      position={whenPageMode({
        full: 'unset',
        popup: 'fixed',
      })}
    >
      {children}
    </Flex>
  );
}
