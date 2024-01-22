import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { useFormikContext } from 'formik';

import { Button } from '@app/ui/components/button/button';

interface PreviewButtonProps {
  text?: string;
  isDisabled?: boolean;
}
export function PreviewButton({ text = 'Continue', isDisabled, ...props }: PreviewButtonProps) {
  const { handleSubmit } = useFormikContext();

  return (
    <Button
      data-testid={SendCryptoAssetSelectors.PreviewSendTxBtn}
      disabled={isDisabled}
      onClick={() => handleSubmit()}
      type="submit"
      {...props}
    >
      {text}
    </Button>
  );
}
