import { forwardRefWithAs } from '@stacks/ui-core';
import { BoxProps, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

// #4164 FIXME migrate - get rid of this file when possible

const interMetrics = {
  capHeight: 2048,
  ascent: 2728,
  descent: -680,
  lineGap: 0,
  unitsPerEm: 2816,
};

const c1 = {
  fontMetrics: interMetrics,
  fontSize: 14,
};

const c2 = {
  fontMetrics: interMetrics,
  fontSize: 12,
};

const c3 = {
  fontMetrics: interMetrics,
  fontSize: 10,
};

const captionStyles = (variant?: 'c1' | 'c2' | 'c3') => {
  switch (variant) {
    case 'c3':
      return c3;
    case 'c2':
      return c2;
    default:
      return c1;
  }
};

type Headings = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';

export const Title = forwardRefWithAs<BoxProps, Headings>((props, ref) => (
  <styled.span
    userSelect="none"
    letterSpacing="-0.01em"
    fontFamily="Diatype"
    fontWeight="500"
    ref={ref}
    display="block"
    {...props}
  />
));

export const Text = forwardRefWithAs<BoxProps, 'span'>((props, ref) => (
  <styled.span letterSpacing="-0.01em" display="block" lineHeight="1.5" ref={ref} {...props} />
));

export function Body(props: BoxProps) {
  return <styled.span css={c1} {...props} />;
}
// #4164 FIXME migrate - need to refactor all <Captions
export const Caption = forwardRefWithAs<{ variant?: 'c1' | 'c2' | 'c3' } & BoxProps, 'span'>(
  ({ variant, ...props }, ref) => (
    <styled.span
      letterSpacing="-0.01em"
      css={captionStyles(variant)}
      color={token('colors.accent.text-subdued')}
      display="block"
      ref={ref}
      {...props}
    />
  )
);

export function CaptionSeparatorDot(props: BoxProps) {
  return (
    <styled.span color={token('colors.accent.text-subdued')} fontSize="10px" {...props}>
      •
    </styled.span>
  );
}
