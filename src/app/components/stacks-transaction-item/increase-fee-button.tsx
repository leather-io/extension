import { FiFastForward } from 'react-icons/fi';

import { token } from 'leather-styles/tokens';

import { LeatherButton } from '../button/button';

interface IncreaseFeeButtonProps {
  isEnabled?: boolean;
  isHovered: boolean;
  isSelected: boolean;
  onIncreaseFee(): void;
}
export function IncreaseFeeButton(props: IncreaseFeeButtonProps) {
  const { isEnabled, isHovered, isSelected, onIncreaseFee } = props;
  const isActive = isEnabled && isHovered && !isSelected;

  return (
    <LeatherButton
      _hover={{
        color: token('colors.accent.action-primary-default'),
      }}
      color={token('colors.accent.text-primary')}
      fontSize={0}
      minWidth="105px"
      ml="auto"
      variant="ghost"
      // #4164 FIXME migrate tertiary buttons
      // mode="tertiary"
      onClick={e => {
        onIncreaseFee();
        e.stopPropagation();
      }}
      opacity={!isActive ? 0 : 1}
      pointerEvents={!isActive ? 'none' : 'all'}
      // FIXME fix this size
      //size="sm"
      zIndex={999}
    >
      {/* // #4164 FIXME migrate accent colour + chheck this icon*/}
      <FiFastForward color={token('colors.accent.text-primary')} style={{ marginRight: '3px' }} />
      Increase fee
    </LeatherButton>
  );
}
