import { ButtonProps } from '@stacks/ui';
import { SendFormSelectors } from '@tests-legacy/page-objects/send-form.selectors';

import { PrimaryButton } from '@app/components/primary-button';

export function ConfirmationButton(props: ButtonProps) {
  return (
    <PrimaryButton data-testid={SendFormSelectors.SendToken} width="100%" {...props}>
      Send
    </PrimaryButton>
  );
}
