import { forwardRef } from 'react';

import * as RadixAvatar from '@radix-ui/react-avatar';
import { type RecipeVariantProps, css, cva } from 'leather-styles/css';
import { type HTMLStyledProps, styled } from 'leather-styles/jsx';

export const defaultFallbackDelay = 600;
export function getAvatarFallback(val: string) {
  return val.slice(0, 2);
}

const avatarRecipe = cva({
  base: {
    alignItems: 'center',
    bg: 'ink.background-secondary',
    display: 'inline-flex',
    justifyContent: 'center',
    overflow: 'hidden',
    userSelect: 'none',
    verticalAlign: 'middle',
  },
  variants: {
    size: {
      sm: { width: 'sm', height: 'sm' },
      md: { width: 'md', height: 'md' },
      lg: { width: 'lg', height: 'lg' },
      xl: { width: 'xl', height: 'xl' },
      xxl: { width: 'xxl', height: 'xxl' },
    },
    variant: {
      circle: { rounded: '100%' },
      square: { rounded: 'xs' },
    },
  },
  defaultVariants: {
    size: 'xl',
    variant: 'circle',
  },
});

type AvatarVariants = RecipeVariantProps<typeof avatarRecipe>;
export type AvatarProps = RadixAvatar.AvatarProps & AvatarVariants;

function Root({ size, variant, ...props }: AvatarProps) {
  return <RadixAvatar.Root className={avatarRecipe({ size, variant })} {...props} />;
}

const avatarImageStyles = css({
  aspectRatio: '1 / 1',
  height: '100%',
  objectFit: 'cover',
  rounded: 'inherit',
  width: '100%',
});
const Image: typeof RadixAvatar.Image = forwardRef((props, ref) => (
  <RadixAvatar.Image className={avatarImageStyles} ref={ref} {...props} />
));

const avatarFallbackStyles = css({
  alignItems: 'center',
  bg: 'inherit',
  border: '1px solid',
  borderColor: 'ink.border-default',
  color: 'ink.text-primary',
  display: 'flex',
  fontWeight: 500,
  height: '100%',
  justifyContent: 'center',
  rounded: 'inherit',
  textStyle: 'label.02',
  width: '100%',
});
const Fallback: typeof RadixAvatar.Fallback = forwardRef((props, ref) => (
  <RadixAvatar.Fallback className={avatarFallbackStyles} ref={ref} {...props} />
));

const avatarIconStyles = css({
  alignItems: 'center',
  bg: 'inherit',
  border: '1px solid',
  borderColor: 'ink.border-default',
  display: 'flex',
  height: '100%',
  justifyContent: 'center',
  rounded: 'inherit',
  width: '100%',
});
function Icon(props: HTMLStyledProps<'span'>) {
  return <styled.span className={avatarIconStyles} {...props} />;
}

const avatarSvgStyles = css({
  alignItems: 'center',
  display: 'flex',
  height: '100%',
  justifyContent: 'center',
  rounded: 'inherit',
  width: '100%',
});
function Svg({ children, ...props }: HTMLStyledProps<'span'>) {
  return (
    <styled.span className={avatarSvgStyles} {...props}>
      <styled.svg width="100%" height="100%" viewBox="0 0 32 32" fill="none">
        {children}
      </styled.svg>
    </styled.span>
  );
}

export const Avatar = { Root, Image, Fallback, Icon, Svg };
