import {
  type ComponentProps,
  LegacyRef,
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
import { useRegisterChildren } from '@app/common/hooks/use-register-children';
import { propIfDefined } from '@app/common/utils';
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
      zIndex: 4,
      color: 'ink.text-subdued',
      _before: {
        content: '""',
        rounded: 'xs',
        pos: 'absolute',
        top: '-1px',
        left: '-1px',
        right: '-1px',
        bottom: '-1px',
        border: '3px solid transparent',
        zIndex: 9,
        pointerEvents: 'none',
      },
      _focusWithin: {
        '& label': { color: 'ink.text-primary', ...transformedLabelStyles },
        _before: {
          border: 'action',
          borderWidth: '2px',
        },
      },
      '&[data-has-error="true"]': {
        color: 'red.action-primary-default',
        _before: {
          borderColor: 'red.action-primary-default',
          borderWidth: '2px',
        },
      },
    },
    input: {
      background: 'transparent',
      appearance: 'none',
      rounded: 'xs',
      pos: 'absolute',
      px: 'space.04',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 5,
      textStyle: 'body.02',
      color: 'ink.text-primary',
      border: '1px solid',
      borderColor: 'ink.border-transparent',
      _disabled: {
        bg: 'ink.component-background-default',
        borderColor: 'ink.non-interactive',
        cursor: 'not-allowed',
      },
      _focus: { ring: 'none' },
      _placeholder: { color: 'ink.text-subdued' },
      '&:placeholder-shown + label': transformedLabelStyles,
      '[data-has-label="true"] &': {
        pt: '22px',
      },
    },
    label: {
      pos: 'absolute',
      top: '38%',
      left: 'space.04',
      zIndex: 9,
      color: 'inherit',
      textStyle: 'body.02',
      transition: 'font-size 100ms ease-in-out, transform 100ms ease-in-out',
      // Move the input's label to the top when the input has a value
      '[data-has-value="true"] &': transformedLabelStyles,
      '[data-shrink="true"] &': transformedLabelStyles,
    },
  },
});

type InputChildren = 'root' | 'label' | 'input';

const { withProvider, withContext } = createStyleContext(input);

interface InputContextProps {
  hasValue: boolean;
  setHasValue(hasValue: boolean): void;
  registerChild(child: string): void;
  children: InputChildren[];
}

const InputContext = createContext<InputContextProps | null>(null);

function useInputContext() {
  const context = useContext(InputContext);
  if (!context) throw new Error('useInputContext must be used within an Input.Root');
  return context;
}

const RootBase = withProvider('div', 'root');

interface RootProps extends ComponentProps<'div'> {
  hasError?: boolean;
  /**
   * Display the label in a top fixed position. Often necessary when
   * programmatically updating inputs, similar to issues described here
   * https://mui.com/material-ui/react-text-field/#limitations
   */
  shrink?: boolean;
}
function Root({ hasError, shrink, ...props }: RootProps) {
  const [hasValue, setHasValue] = useState(false);

  const { registerChild, children, hasChild } = useRegisterChildren<InputChildren>();

  const dataAttrs = {
    ...propIfDefined('data-has-error', hasError),
    ...propIfDefined('data-shrink', shrink),
    'data-has-label': hasChild('label'),
  };

  return (
    <InputContext.Provider value={{ hasValue, setHasValue, children, registerChild }}>
      <RootBase data-has-value={hasValue} {...dataAttrs} {...props} />
    </InputContext.Provider>
  );
}

const FieldBase = withContext('input', 'input');

const Field = forwardRef(({ type, ...props }: ComponentProps<'input'>, ref) => {
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

  // `type=number` is bad UX, instead we follow guidance here
  // https://mui.com/material-ui/react-text-field/#type-quot-number-quot
  // https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/
  const inputTypeProps =
    type === 'number'
      ? ({ type: 'text', inputMode: 'numeric', pattern: '[0-9]*' } as const)
      : { type };

  return (
    <FieldBase
      ref={innerRef}
      {...inputTypeProps}
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

const LabelBase = withContext('label', 'label');

const Label = forwardRef((props: ComponentProps<'label'>, ref: LegacyRef<HTMLLabelElement>) => {
  const { registerChild } = useInputContext();
  useOnMount(() => registerChild('label'));
  return <LabelBase ref={ref} {...props} />;
});

export const Input = { Root, Field, Label };
