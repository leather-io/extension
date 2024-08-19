import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { useFormikContext } from 'formik';
import { HStack, Stack } from 'leather-styles/jsx';

import {
  Button,
  Caption,
  Dialog,
  DialogHeader,
  ErrorTriangleIcon,
  Link,
  Title,
} from '@leather.io/ui';

import { StacksSendFormValues } from '@shared/models/form.model';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { ButtonRow } from '@app/components/layout';

import { useStacksHighFeeWarningContext } from './stacks-high-fee-warning-container';

interface HighFeeDialogProps {
  learnMoreUrl: string;
}
export function HighFeeDialog({ learnMoreUrl }: HighFeeDialogProps) {
  const { handleSubmit, values } = useFormikContext<StacksSendFormValues>();
  const { showHighFeeWarningDialog, setHasBypassedFeeWarning, setShowHighFeeWarningDialog } =
    useStacksHighFeeWarningContext();

  return (
    <Dialog
      data-testid={SendCryptoAssetSelectors.HighFeeWarningDialog}
      header={<DialogHeader />}
      isShowing={showHighFeeWarningDialog}
      onClose={() => setShowHighFeeWarningDialog(false)}
      footer={
        <ButtonRow flexDirection="row">
          <Button onClick={() => setShowHighFeeWarningDialog(false)} variant="outline" flexGrow={1}>
            Edit fee
          </Button>
          <Button
            onClick={() => {
              setHasBypassedFeeWarning(true);
              handleSubmit();
            }}
            data-testid={SendCryptoAssetSelectors.HighFeeWarningDialogSubmit}
            type="submit"
            flexGrow={1}
          >
            Yes, I'm sure
          </Button>
        </ButtonRow>
      }
    >
      <Stack px="space.05" gap="space.05" pb="space.06">
        <HStack>
          <ErrorTriangleIcon color="red.action-primary-default" />
          <Title>
            Are you sure you want to pay {values.fee} {values.feeCurrency} in fees for this
            transaction?
          </Title>
        </HStack>
        <Caption>
          This action cannot be undone. The fees won't be returned, even if the transaction fails.
          <Link onClick={() => openInNewTab(learnMoreUrl)} size="sm" ml="space.01">
            Learn more
          </Link>
        </Caption>
      </Stack>
    </Dialog>
  );
}
