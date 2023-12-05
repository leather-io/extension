import { ForwardedRef, forwardRef } from 'react';

import { styled } from 'leather-styles/jsx';
import { type LinkVariantProps, link as linkRecipe } from 'leather-styles/recipes/link';

const StyledLink = styled('a');

type LinkProps = Omit<React.ComponentProps<typeof StyledLink>, keyof LinkVariantProps> &
  LinkVariantProps;

export const Link = forwardRef((props: LinkProps, ref: ForwardedRef<HTMLAnchorElement>) => {
  const { children, disabled, fullWidth, size, invert, variant, ...rest } = props;

  return (
    <StyledLink
      ref={ref}
      className={linkRecipe({ disabled, fullWidth, invert, size, variant })}
      cursor="pointer"
      {...rest}
    >
      {children}
    </StyledLink>
  );
});
