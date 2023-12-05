import { styled } from 'leather-styles/jsx';
import { type ButtonVariantProps, button as buttonRecipe } from 'leather-styles/recipes';

const StyledButton = styled('button');

type ButtonProps = Omit<React.ComponentProps<typeof StyledButton>, keyof ButtonVariantProps> &
  ButtonVariantProps;

export function Button(props: ButtonProps) {
  const { children, fullWidth, size, trigger, invert, type = 'button', variant, ...rest } = props;
  // pete - not sure we need this invert but it could be thje key difference
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
