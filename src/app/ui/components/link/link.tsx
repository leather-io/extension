import { styled } from 'leather-styles/jsx';
import { type LinkVariantProps, link as linkRecipe } from 'leather-styles/recipes/link';

const StyledLink = styled('a');

type LinkProps = Omit<React.ComponentProps<typeof StyledLink>, keyof LinkVariantProps> &
  LinkVariantProps;

export function Link(props: LinkProps) {
  const { children, fullWidth, invert, size, variant, ...rest } = props;

  return (
    <StyledLink
      className={linkRecipe({ fullWidth, invert, size, variant })}
      cursor="pointer"
      {...rest}
    >
      {children}
    </StyledLink>
  );
}
