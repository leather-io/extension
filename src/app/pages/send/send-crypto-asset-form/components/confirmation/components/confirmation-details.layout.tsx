import { Box, Stack, StackProps, Text } from '@stacks/ui';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

import { Money } from '@shared/models/money.model';

import { convertAmountToBaseUnit } from '@app/common/money/calculate-money';

interface ConfirmationDetailsLayoutProps extends StackProps {
  amount: Money;
}
export function ConfirmationDetailsLayout(props: ConfirmationDetailsLayoutProps) {
  const { amount, children } = props;

  return (
    <Box data-testid={SendCryptoAssetSelectors.ConfirmationDetails} mb="extra-loose" width="100%">
      <Text
        data-testid={SendCryptoAssetSelectors.ConfirmationDetailsAmountAndSymbol}
        fontSize="40px"
        fontWeight={500}
        mb="48px"
        textAlign="center"
        width="100%"
      >
        {convertAmountToBaseUnit(amount).toFormat()} {amount.symbol.toUpperCase()}
      </Text>
      <Stack fontSize={1} px="extra-tight" spacing="base" width="100%">
        {children}
      </Stack>
    </Box>
  );
}
