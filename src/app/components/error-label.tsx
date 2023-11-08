import { css } from 'leather-styles/css';
import { HStack, HstackProps } from 'leather-styles/jsx';

import { AlertIcon } from './icons/alert-icon';

export function ErrorLabel({ children, ...rest }: HstackProps) {
  return (
    <HStack
      gap="tight"
      color="error"
      alignItems="flex-start"
      {...rest}
      textAlign="left"
      width="100%"
      textStyle="body.02"
      className={css({
        '& svg': {
          mt: '2px',
        },
      })}
    >
      <AlertIcon />
      {children}
    </HStack>
  );
}
