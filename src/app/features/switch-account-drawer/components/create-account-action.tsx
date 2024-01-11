import { Flex } from 'leather-styles/jsx';

import { Button } from '@app/ui/components/button/button';

interface CreateAccountActionProps {
  onCreateAccount(): void;
}
export function CreateAccountAction({ onCreateAccount }: CreateAccountActionProps) {
  return (
    <Flex
      mt="100px"
      py="space.05"
      px="space.05"
      flexGrow="1"
      position="fixed"
      bottom={0}
      width="100%"
      zIndex={1}
    >
      <Button fullWidth onClick={() => onCreateAccount()}>
        Create new account
      </Button>
    </Flex>
  );
}
