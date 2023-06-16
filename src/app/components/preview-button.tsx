import { Button, ButtonProps } from '@stacks/ui';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { useFormikContext } from 'formik';

interface PreviewButtonProps extends ButtonProps {
  text?: string;
}

export function PreviewButton({ text = 'Continue', ...props }: PreviewButtonProps) {
  const { handleSubmit } = useFormikContext();

  return (
    <Button
      type="button"
      borderRadius="10px"
      data-testid={SendCryptoAssetSelectors.PreviewSendTxBtn}
      height="48px"
      mb="base"
      onClick={handleSubmit}
      width="100%"
      {...props}
    >
      {text}
    </Button>
  );
}
