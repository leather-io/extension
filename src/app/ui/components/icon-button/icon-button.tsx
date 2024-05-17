import { Stack, styled } from 'leather-styles/jsx';

import { Button, type ButtonProps } from '@app/ui/components/button/button';
import AccessibleIcon from '@app/ui/components/icon-button/accessible-icon';

interface IconButtonProps extends ButtonProps {
  icon: React.JSX.Element;
  label?: string;
}
export function IconButton({ icon, label, disabled, ...rest }: IconButtonProps) {
  return (
    <Button
      key={label}
      color="ink.text-primary"
      p={label ? 'space.01' : 'space.02'}
      textStyle="label.02"
      variant="ghost"
      width={label ? 'iconButtonWithLabelWidth' : 'unset'}
      outline="none"
      opacity={disabled ? '0.5' : '1'}
      disabled={disabled}
      {...rest}
    >
      <Stack alignItems="center" gap="space.01">
        <AccessibleIcon label={label || icon.type.displayName || 'Icon Button'}>
          {icon}
        </AccessibleIcon>
        {label && <styled.span>{label}</styled.span>}
      </Stack>
    </Button>
  );
}
