import { css } from 'leather-styles/css';
import { Flex, type FlexProps } from 'leather-styles/jsx';

import { InfoIcon } from '../icons/info-icon';

const calloutStyles = css({
  padding: 'space.03',
  alignItems: 'center',
  animationDuration: '500s',

  '&[data-variant="default"]': {
    backgroundColor: 'success.background',
  },
  '&[data-variant="success"]': {
    backgroundColor: 'success.background',
  },
  '&[data-variant="error"]': {
    backgroundColor: 'error.background',
  },
  '&[data-variant="warning"]': {
    backgroundColor: 'warning.label',
  },
  '&[data-variant="neutral"]': {
    backgroundColor: 'accent.non-interactive',
  },
  '&[data-visible="true"]': {
    animation: 'fadein',
  },
  '&[data-visible="false"]': {
    animation: 'fadeout',
  },
});

interface CalloutProps extends FlexProps {
  variant?: 'info' | 'warning' | 'error' | 'success' | 'neutral' | 'default';
  icon?: 'info';
}
export function Callout(props: CalloutProps) {
  const { variant = 'default', icon, ...rest } = props;
  return (
    <Flex data-variant={variant} className={calloutStyles} {...rest}>
      {icon === 'info' && <InfoIcon mr="space.03" />}
      {props.children}
    </Flex>
  );
}
