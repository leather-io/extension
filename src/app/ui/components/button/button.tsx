import { forwardRef } from 'react';

import { styled } from 'leather-styles/jsx';
import { type ButtonVariantProps, button as buttonRecipe } from 'leather-styles/recipes';

const StyledButton = styled('button');

export type ButtonProps = Omit<
  React.ComponentProps<typeof StyledButton>,
  keyof ButtonVariantProps
> &
  ButtonVariantProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { children, fullWidth, invert, size, trigger, type = 'button', variant, ...rest } = props;
  return (
    <StyledButton
      className={buttonRecipe({ fullWidth, size, invert, trigger, variant })}
      type={type}
      ref={ref}
      {...rest}
    >
      {children}
    </StyledButton>
  );
});
