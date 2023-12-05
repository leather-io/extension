import { useEffect, useState } from 'react';

import { useFormikContext } from 'formik';
import { HStack, Stack } from 'leather-styles/jsx';

import {
  BitcoinSendFormValues,
  StacksSendFormValues,
  StacksTransactionFormValues,
} from '@shared/models/form.model';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { Button } from '@app/ui/components/button/button';
import { Dialog } from '@app/ui/components/containers/dialog/dialog';
import { Link } from '@app/ui/components/link/link';
import { Caption } from '@app/ui/components/typography/caption';
import { Title } from '@app/ui/components/typography/title';
import { ErrorIcon } from '@app/ui/icons';

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
      isShowing={isShowingHighFeeConfirmation}
      onClose={() => setIsShowingHighFeeConfirmation(false)}
    >
      {isShowingHighFeeConfirmation && (
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
          <HStack mt="space.05">
            <Button
              onClick={() => setIsShowingHighFeeConfirmation(false)}
              width="50%"
              variant="outline"
            >
              Edit fee
            </Button>
            <Button onClick={() => handleSubmit()} width="50%" type="submit">
              Yes, I'm sure
            </Button>
          </HStack>
        </Stack>
      )}
    </Dialog>
  );
}
