import { Box, Circle, Flex } from 'leather-styles/jsx';

import { SupportedInscription } from '@shared/models/inscription.model';
import { BitcoinTx } from '@shared/models/transactions/bitcoin-transaction.model';

import { getColorFromBitcoinTx } from '@app/common/transactions/bitcoin/utils';
import { OrdinalIcon } from '@app/ui/components/icons/ordinal-icon';

import { TxStatusIcon } from './bitcoin-transaction-icon';

interface BitcoinTransactionInscriptionIconProps {
  inscription: SupportedInscription;
  transaction: BitcoinTx;
  btcAddress: string;
}

function InscriptionIcon({ inscription, ...rest }: { inscription: SupportedInscription }) {
  switch (inscription.type) {
    case 'image':
      return (
        <Circle
          bg="stacks"
          color="accent.background-primary"
          flexShrink={0}
          position="relative"
          size="36px"
          {...rest}
        >
          <img
            src={inscription.src}
            style={{
              width: '100%',
              height: '100%',
              aspectRatio: '1 / 1',
              objectFit: 'cover',
              borderRadius: '6px',
            }}
          />
        </Circle>
      );
    default:
      return <OrdinalIcon />;
  }
}

export function BitcoinTransactionInscriptionIcon({
  inscription,
  transaction,
  btcAddress,
  ...rest
}: BitcoinTransactionInscriptionIconProps) {
  return (
    <Flex position="relative">
      <InscriptionIcon inscription={inscription} />
      <Circle
        bottom="-2px"
        right="-9px"
        position="absolute"
        size="21px"
        bg={getColorFromBitcoinTx(transaction)}
        color="accent.background-primary"
        border="background"
        {...rest}
      >
        <Box height="13px" width="13px">
          <TxStatusIcon address={btcAddress} tx={transaction} />
        </Box>
      </Circle>
    </Flex>
  );
}
