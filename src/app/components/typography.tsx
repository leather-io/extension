import { Text as BaseText, BoxProps, color } from '@stacks/ui';
import { forwardRefWithAs } from '@stacks/ui-core';

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
  <BaseText
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
  <BaseText letterSpacing="-0.01em" display="block" lineHeight="1.5" ref={ref} {...props} />
));

export function Body(props: BoxProps) {
  return <Text css={c1} {...props} />;
}

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
