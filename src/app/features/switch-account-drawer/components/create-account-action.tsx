import { Flex } from 'leather-styles/jsx';

import { LeatherButton } from '@app/components/button/button';

interface CreateAccountActionProps {
  onCreateAccount(): void;
}
export function CreateAccountAction({ onCreateAccount }: CreateAccountActionProps) {
  return (
    <Flex py="space.05" px="space.05" flexGrow="1" position="fixed" bottom={0} width="100%">
      <LeatherButton fullWidth onClick={() => onCreateAccount()}>
        Create new account
      </LeatherButton>
    </Flex>
  );
}
