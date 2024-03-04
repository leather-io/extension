import { styled } from 'leather-styles/jsx';
import { type ButtonVariantProps, button as buttonRecipe } from 'leather-styles/recipes';

const StyledButton = styled('button');

export type ButtonProps = Omit<
  React.ComponentProps<typeof StyledButton>,
  keyof ButtonVariantProps
> &
  ButtonVariantProps;

export function Button(props: ButtonProps) {
  const { children, fullWidth, size, trigger, invert, type = 'button', variant, ...rest } = props;
  return (
    <StyledButton
      className={buttonRecipe({ fullWidth, size, invert, trigger, variant })}
      type={type}
      {...rest}
    >
      {children}
    </StyledButton>
  );
}
