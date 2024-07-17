import { IconButton } from '@leather.io/ui';

import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

interface ActionButtonProps {
  icon: React.ReactElement;
  isEnabled?: boolean;
  isSelected: boolean;
  label: string;
  onButtonClick(): void;
}

export function TransactionActionIconButton(props: ActionButtonProps) {
  const { isEnabled, isSelected, onButtonClick, label, icon } = props;
  const isActive = isEnabled && !isSelected;

  if (!isActive) return null;

  return (
    <BasicTooltip label={label} side="top">
      <IconButton
        icon={icon}
        backgroundColor={'ink.background-primary'}
        onClick={e => {
          e.stopPropagation();
          onButtonClick();
        }}
      ></IconButton>
    </BasicTooltip>
  );
}
