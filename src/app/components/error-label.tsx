import { FiAlertCircle } from 'react-icons/fi';

import { css } from 'leather-styles/css';
import { HStack, HstackProps } from 'leather-styles/jsx';

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
      <FiAlertCircle size="1rem" />
      {children}
    </HStack>
  );
}
