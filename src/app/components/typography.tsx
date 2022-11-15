import { Text as BaseText, BoxProps, color } from '@stacks/ui';
import { forwardRefWithAs } from '@stacks/ui-core';

const interMetrics = {
  capHeight: 2048,
  ascent: 2728,
  descent: -680,
  lineGap: 0,
  unitsPerEm: 2816,
};
const openSauceMetrics = {
  capHeight: 1563,
  ascent: 2105,
  descent: -525,
  lineGap: 0,
  unitsPerEm: 2048,
};

const h1 = {
  fontMetrics: openSauceMetrics,
  fontSize: 24,
  leading: 32,
};

// B2
const h2 = {
  fontMetrics: openSauceMetrics,
  fontSize: 18,
  leading: 28,
};
// B3
const h3 = {
  fontMetrics: openSauceMetrics,
  fontSize: 16,
  leading: 24,
};
// C1
const h4 = {
  fontMetrics: openSauceMetrics,
  fontSize: 14,
  leading: 20,
};
// C2
const h5 = {
  fontMetrics: openSauceMetrics,
  fontSize: 12,
  leading: 16,
};

const c1 = {
  fontMetrics: interMetrics,
  fontSize: 14,
  leading: 20,
};

const c2 = {
  fontMetrics: interMetrics,
  fontSize: 12,
  leading: 16,
};

const c3 = {
  fontMetrics: interMetrics,
  fontSize: 10,
  leading: 16,
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

const titleStyles = (as: Headings) => {
  switch (as) {
    case 'h1':
      return h1;
    case 'h2':
      return h2;
    case 'h3':
      return h3;
    case 'h4':
      return h4;
    case 'h5':
    case 'h6':
      return h5;
    default:
      return undefined;
  }
};

export const Title = forwardRefWithAs<BoxProps, Headings>((props, ref) => (
  <BaseText
    userSelect="none"
    letterSpacing="-0.01em"
    fontFamily="'Open Sauce One'"
    fontWeight="500"
    color={color('text-title')}
    ref={ref}
    display="block"
    css={titleStyles(props.as)}
    {...props}
  />
));

export const Text = forwardRefWithAs<BoxProps, 'span'>((props, ref) => (
  <BaseText
    letterSpacing="-0.01em"
    color={color('text-body')}
    display="block"
    lineHeight="1.5"
    ref={ref}
    {...props}
  />
));

export const Body = (props: BoxProps) => <Text css={c1} {...props} />;

export const Caption = forwardRefWithAs<{ variant?: 'c1' | 'c2' | 'c3' } & BoxProps, 'span'>(
  ({ variant, ...props }, ref) => (
    <BaseText
      letterSpacing="-0.01em"
      css={captionStyles(variant)}
      color={color('text-caption')}
      display="block"
      ref={ref}
      {...props}
    />
  )
);

export function CaptionSeparatorDot(props: BoxProps) {
  return (
    <Text color={color('text-caption')} fontSize="10px" {...props}>
      •
    </Text>
  );
}
