import { useEffect, useState } from 'react';

import { useFormikContext } from 'formik';
import { HStack, Stack } from 'leather-styles/jsx';

import { Button, Caption, ErrorIcon, Link, Title } from '@leather-wallet/ui';

import {
  BitcoinSendFormValues,
  StacksSendFormValues,
  StacksTransactionFormValues,
} from '@shared/models/form.model';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { Dialog } from '@app/ui/components/containers/dialog/dialog';
import { Footer } from '@app/ui/components/containers/footers/footer';
import { DialogHeader } from '@app/ui/components/containers/headers/dialog-header';

interface HighFeeDialogProps {
  learnMoreUrl: string;
  isShowing?: boolean;
}

export function HighFeeDialog({ learnMoreUrl, isShowing = false }: HighFeeDialogProps) {
  const [isShowingHighFeeConfirmation, setIsShowingHighFeeConfirmation] = useState(isShowing);

  useEffect(() => {
    return () => {
      if (isShowingHighFeeConfirmation) setIsShowingHighFeeConfirmation(false);
    };
  }, [isShowingHighFeeConfirmation, setIsShowingHighFeeConfirmation]);

  const { handleSubmit, values } = useFormikContext<
    BitcoinSendFormValues | StacksSendFormValues | StacksTransactionFormValues
  >();
  return (
    <Dialog
      header={<DialogHeader />}
      isShowing={isShowingHighFeeConfirmation}
      onClose={() => setIsShowingHighFeeConfirmation(false)}
      footer={
        <Footer flexDirection="row">
          <Button
            onClick={() => setIsShowingHighFeeConfirmation(false)}
            variant="outline"
            flexGrow={1}
          >
            Edit fee
          </Button>
          <Button onClick={() => handleSubmit()} type="submit" flexGrow={1}>
            Yes, I'm sure
          </Button>
        </Footer>
      }
    >
      <Stack px="space.05" gap="space.05" pb="space.06">
        <HStack>
          <ErrorIcon color="red.action-primary-default" width="md" />
          <Title>
            Are you sure you want to pay {values.fee} {values.feeCurrency} in fees for this
            transaction?
          </Title>
        </HStack>
        <Caption>
          This action cannot be undone and the fees won't be returned, even if the transaction
          fails.
          <Link onClick={() => openInNewTab(learnMoreUrl)} size="sm">
            Learn more
          </Link>
        </Caption>
      </Stack>
    </Dialog>
  );
}
