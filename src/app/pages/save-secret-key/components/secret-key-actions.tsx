import { useNavigate } from 'react-router-dom';
import { Button, color, Stack, StackProps, useClipboard } from '@stacks/ui';

import { useWallet } from '@app/common/hooks/use-wallet';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { RouteUrls } from '@shared/route-urls';

interface SecreteKeyActionsProps extends StackProps {
  onClose?: () => void;
}
export function SecretKeyActions(props: SecreteKeyActionsProps): JSX.Element {
  const { onClose, ...rest } = props;
  const { secretKey } = useWallet();
  const { onCopy, hasCopied } = useClipboard(secretKey || '');
  const navigate = useNavigate();

  const analytics = useAnalytics();

  const copyToClipboard = () => {
    void analytics.track('copy_secret_key_to_clipboard');
    onCopy();
  };

  const handleOnClick = () => {
    navigate(RouteUrls.SetPassword);
  };

  return (
    <Stack spacing="base" {...rest}>
      <Button
        data-testid="copy-key-to-clipboard"
        width="100%"
        border="1px solid"
        borderColor={color('border')}
        color={color(hasCopied ? 'text-caption' : 'brand')}
        mode="tertiary"
        borderRadius="10px"
        onClick={hasCopied ? undefined : copyToClipboard}
      >
        {hasCopied ? 'Copied!' : 'Copy to clipboard'}
      </Button>
      <Button
        width="100%"
        onClick={handleOnClick}
        data-testid="confirm-saved-key"
        borderRadius="10px"
      >
        I've saved it
      </Button>
    </Stack>
  );
}
