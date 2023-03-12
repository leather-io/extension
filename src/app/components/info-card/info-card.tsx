import { Box, Button, Flex, FlexProps, Stack, Text } from '@stacks/ui';

import { isString } from '@shared/utils';

import { AddressDisplayer } from '../address-displayer/address-displayer';
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
  isAddressDisplayer?: boolean;
}

export function InfoCardRow({ title, value, isAddressDisplayer }: InfoCardRowProps) {
  return (
    <SpaceBetween fontSize="14px" alignItems="start">
      <Text color="#74777D">{title}</Text>
      {isAddressDisplayer && isString(value) ? (
        <Box
          maxWidth="300px"
          display="flex"
          flexWrap="wrap"
          justifyContent="end"
          mr="-8px"
          fontSize="16px"
        >
          <AddressDisplayer address={value} />
        </Box>
      ) : (
        <Text color="#242629" fontWeight="500">
          {value}
        </Text>
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
  fiatValue: string;
  symbol: string;
  icon?: React.FC;
}

export function InfoCardAssetValue({ value, fiatValue, symbol, icon }: InfoCardAssetValueProps) {
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
      {icon && <Box as={icon} size="16px" />}

      <Flex flexDirection="column" alignItems="center">
        <Text fontSize="24px" fontWeight="500" mb="4px" lineHeight="36px">
          {value} {symbol}
        </Text>
        <Text fontSize="12px">~ {fiatValue} USD</Text>
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
