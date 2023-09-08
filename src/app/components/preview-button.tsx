import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { useFormikContext } from 'formik';

import { LeatherButton } from '@app/components/button/button';

interface PreviewButtonProps {
  text?: string;
  isDisabled?: boolean;
}
export function PreviewButton({ text = 'Continue', isDisabled, ...props }: PreviewButtonProps) {
  const { handleSubmit } = useFormikContext();

  return (
    <LeatherButton
      data-testid={SendCryptoAssetSelectors.PreviewSendTxBtn}
      disabled={isDisabled}
      onClick={() => handleSubmit()}
      {...props}
    >
      {text}
    </LeatherButton>
  );
}
