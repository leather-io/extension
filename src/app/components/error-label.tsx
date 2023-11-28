import { css } from 'leather-styles/css';
import { HStack, HstackProps } from 'leather-styles/jsx';

import { ErrorCircleIcon } from '@app/ui/components/icons/error-circle-icon';

export function ErrorLabel({ children, ...rest }: HstackProps) {
  return (
    <HStack
      alignItems="flex-start"
      className={css({
        '& svg': {
          mt: '2px',
        },
      })}
      color="error.label"
      gap="space.02"
      textAlign="left"
      textStyle="body.02"
      {...rest}
    >
      <ErrorCircleIcon />
      {children}
    </HStack>
  );
}
