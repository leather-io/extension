import {
  type ComponentProps,
  createContext,
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { sva } from 'leather-styles/css';
import { SystemStyleObject } from 'leather-styles/types';

import { useOnMount } from '@app/common/hooks/use-on-mount';
import { createStyleContext } from '@app/ui/utils/style-context';

const hackyDelayOneMs = 1;

const transformedLabelStyles: SystemStyleObject = {
  textStyle: 'label.03',
  transform: 'translateY(-12px)',
  fontWeight: 500,
};

const input = sva({
  slots: ['root', 'label', 'input'],
  base: {
    root: {
      display: 'block',
      pos: 'relative',
      minHeight: '64px',
      p: 'space.04',
      ring: 'none',
      textStyle: 'body.02',
      minW: '220px',
      zIndex: 4,
      color: 'accent.text-subdued',
      _before: {
        content: '""',
        // TODO: outdated design system file
        rounded: '2px',
        pos: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        border: 'default',
        borderColor: 'accent.border-hover',
      },
      '&[data-has-error]': {
        color: 'error.label',
        _before: {
          borderColor: 'error.label',
          borderWidth: '2px',
        },
      },
      // Move the input's label to the top when the input has a value
      '&[data-has-value="true"] label': transformedLabelStyles,
      _focusWithin: {
        '& label': { color: 'accent.text-primary', ...transformedLabelStyles },
        _before: {
          border: 'action',
          borderWidth: '2px',
        },
      },
    },
    input: {
      background: 'transparent',
      appearance: 'none',
      pos: 'absolute',
      pt: '22px',
      pb: '4px',
      px: 'space.04',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 5,
      textStyle: 'body.01',
      color: 'accent.text-primary',
      _disabled: {
        bg: 'accent.background-secondary',
        cursor: 'not-allowed',
      },
      _focus: { ring: 'none' },
      '&:placeholder-shown + label': transformedLabelStyles,
    },
    label: {
      pointerEvents: 'none',
      pos: 'absolute',
      top: '36%',
      left: 'space.04',
      zIndex: 9,
      color: 'inherit',
      textStyle: 'body.02',
      transition: 'all 100ms ease-in-out',
    },
  },
});

const { withProvider, withContext } = createStyleContext(input);

const InputContext = createContext<null | { hasValue: boolean; setHasValue(x: boolean): void }>(
  null
);

function useInputContext() {
  const context = useContext(InputContext);
  if (!context) throw new Error('useInputContext must be used within an Input.Root');
  return context;
}

const RootBase = withProvider('div', 'root');

function Root(props: ComponentProps<'div'>) {
  const [hasValue, setHasValue] = useState(false);
  return (
    <InputContext.Provider value={{ hasValue, setHasValue }}>
      <RootBase data-has-value={hasValue} {...props} />
    </InputContext.Provider>
  );
}

const FieldBase = withContext('input', 'input');

const Field = forwardRef((props: ComponentProps<'input'>, ref) => {
  const { setHasValue } = useInputContext();
  const innerRef = useRef<HTMLInputElement | null>(null);

  useImperativeHandle(ref, () => innerRef.current);

  // We need to determine whether the input has a value on it's initial
  // render. In many places we use Formik to apply default form values.
  // Formik sets these values after the initial render, so we need to wait
  // before doing this check to see if there's a value.
  useOnMount(
    () =>
      void setTimeout(() => {
        if (innerRef.current?.value !== '') setHasValue(true);
      }, hackyDelayOneMs)
  );

  return (
    <FieldBase
      ref={innerRef}
      {...props}
      onInput={e => {
        // Note: this logic to determine if the field is empty may have to be
        // made dynamic to `input=type`, and potentially made configurable with
        // a callback passed to `Input.Root` e.g.
        // ```
        //    <Input.Root isEmptyFn={value => typeof value === 'number' && value <= 0} />
        // ```
        if (e.target instanceof HTMLInputElement) setHasValue(e.target.value !== '');
        props.onInput?.(e);
      }}
    />
  );
});

const Label = withContext('label', 'label');

export const Input = { Root, Field, Label };
