import { Flex } from '@radix-ui/themes';

import { LeatherButton } from '@app/components/button/button';

interface CreateAccountActionProps {
  onCreateAccount(): void;
}
export function CreateAccountAction({ onCreateAccount }: CreateAccountActionProps) {
  return (
    <Flex pt="5" pb="5" px="5" grow="1">
      <LeatherButton fullWidth onClick={() => onCreateAccount()}>
        Create new account
      </LeatherButton>
    </Flex>
  );
}
