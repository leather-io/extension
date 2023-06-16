import { css } from '@emotion/react';
import * as Switch from '@radix-ui/react-switch';

interface ToggleInputProps {
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToggleInput({ name, checked, onChange }: ToggleInputProps) {
  return (
    <Switch.Root
      css={css`
        width: 42px;
        height: 24px;
        background-color: #efeff2;
        border-radius: 9999px;
        position: relative;
        transition: all 100ms;
        &[data-state='checked'] {
          background-color: #5546ff;
        }
      `}
      checked={checked}
      onCheckedChange={onChange}
      id={name}
      name={name}
    >
      <Switch.Thumb
        css={css`
          display: block;
          width: 20px;
          height: 20px;
          background-color: white;
          border-radius: 9999px;
          transition: all 100ms;
          transform: translateX(2px);
          will-change: transform;
          &[data-state='checked'] {
            transform: translateX(19px);
          }
        `}
        id={name}
      />
    </Switch.Root>
  );
}
