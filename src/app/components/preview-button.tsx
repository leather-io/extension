import { Button, ButtonProps } from '@stacks/ui';
import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { useFormikContext } from 'formik';

interface PreviewButtonProps extends ButtonProps {
  isDisabled?: boolean;
  text?: string;
}
export function PreviewButton({ isDisabled, text = 'Continue', ...props }: PreviewButtonProps) {
  const { handleSubmit } = useFormikContext();

  return (
    <Button
      borderRadius="10px"
      data-testid={SendCryptoAssetSelectors.PreviewSendTxBtn}
      height="48px"
      isDisabled={isDisabled}
      mb="base"
      onClick={handleSubmit}
      type="button"
      width="100%"
      {...props}
    >
      {text}
    </Button>
  );
}
