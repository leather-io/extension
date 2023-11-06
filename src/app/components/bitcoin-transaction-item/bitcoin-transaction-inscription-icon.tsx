import { FiArrowDown as IconArrowDown, FiArrowUp as IconArrowUp } from 'react-icons/fi';

import { Circle, Flex } from 'leather-styles/jsx';

import { SupportedInscription } from '@shared/models/inscription.model';
import { BitcoinTx } from '@shared/models/transactions/bitcoin-transaction.model';

import { isBitcoinTxInbound } from '@app/common/transactions/bitcoin/utils';
import { color } from '@app/common/utils/stacks-ui/ui/colors';

import { OrdinalIcon } from '../icons/ordinal-icon';
import { colorFromTx } from './utils';

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
          bg={color('accent')}
          color={color('bg')}
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
        bg={color(colorFromTx(transaction))}
        color={color('bg')}
        border="2px solid"
        borderColor={color('bg')}
        {...rest}
      >
        {isBitcoinTxInbound(btcAddress, transaction) ? <IconArrowDown /> : <IconArrowUp />}
      </Circle>
    </Flex>
  );
}
