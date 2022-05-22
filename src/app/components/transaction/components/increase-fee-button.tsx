import { FiFastForward } from 'react-icons/fi';
import { Box, Button, color } from '@stacks/ui';

import { useRawTxIdState } from '@app/store/transactions/raw.hooks';

export const IncreaseFeeButton = ({
  isEnabled,
  isHovered,
  txid,
}: {
  isEnabled?: boolean;
  isHovered: boolean;
  txid: string;
}) => {
  const [rawTxId, setTxId] = useRawTxIdState();
  const isSelected = rawTxId === txid;
  const isActive = isEnabled && !isSelected && isHovered;
  return (
    <Button
      _hover={{
        color: color('text-title'),
      }}
      color={color('text-body')}
      fontSize={0}
      minWidth="105px"
      ml="auto"
      mode="tertiary"
      onClick={e => {
        setTxId(txid);
        e.stopPropagation();
      }}
      opacity={!isActive ? 0 : 1}
      pointerEvents={!isActive ? 'none' : 'all'}
      size="sm"
      zIndex={999}
    >
      <Box mr="3px" as={FiFastForward} color={color('accent')} />
      Increase fee
    </Button>
  );
};
