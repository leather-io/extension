import { Outlet, useNavigate } from 'react-router-dom';

import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { Form, Formik, FormikHelpers } from 'formik';
import { Box, Flex } from 'leather-styles/jsx';
import { ObjectSchema } from 'yup';

import { HIGH_FEE_WARNING_LEARN_MORE_URL_STX } from '@leather.io/constants';
import type { Fees, Money } from '@leather.io/models';
import { Button, Link } from '@leather.io/ui';
import { formatMoney } from '@leather.io/utils';

import { StacksSendFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';

import { FeesRow } from '@app/components/fees-row/fees-row';
import { AvailableBalance, ButtonRow, Card, Page } from '@app/components/layout';
import { NonceSetter } from '@app/components/nonce-setter';
import { useUpdatePersistedSendFormValues } from '@app/features/popup-send-form-restoration/use-update-persisted-send-form-values';
import { HighFeeSheet } from '@app/features/stacks-high-fee-warning/stacks-high-fee-dialog';
import { useIsPrivateMode } from '@app/store/settings/settings.selectors';

import { MemoField } from '../../components/memo-field';
import { StacksRecipientField } from '../../family/stacks/components/stacks-recipient-field';
import { defaultSendFormFormikProps } from '../../send-form.utils';

interface StacksCommonSendFormProps {
  onSubmit(
    values: StacksSendFormValues,
    formikHelpers: FormikHelpers<StacksSendFormValues>
  ): Promise<void>;
  initialValues: StacksSendFormValues;
  validationSchema: ObjectSchema<any>;
  amountField: React.JSX.Element;
  selectedAssetField: React.JSX.Element;
  availableTokenBalance: Money;
  fees?: Fees;
}

export function StacksCommonSendForm({
  onSubmit,
  initialValues,
  validationSchema,
  amountField,
  selectedAssetField,
  fees,
  availableTokenBalance,
}: StacksCommonSendFormProps) {
  const navigate = useNavigate();
  const { onFormStateChange } = useUpdatePersistedSendFormValues();
  const isPrivate = useIsPrivateMode();
  return (
    <Page>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        {...defaultSendFormFormikProps}
      >
        {props => {
          onFormStateChange(props.values);
          return (
            <>
              <NonceSetter />
              <Form>
                <Card
                  dataTestId={SendCryptoAssetSelectors.SendForm}
                  footer={
                    <ButtonRow>
                      <Button
                        aria-busy={props.isValidating}
                        data-testid={SendCryptoAssetSelectors.PreviewSendTxBtn}
                        type="submit"
                        fullWidth
                      >
                        Continue
                      </Button>
                      <AvailableBalance
                        balance={formatMoney(availableTokenBalance)}
                        isPrivate={isPrivate}
                      />
                    </ButtonRow>
                  }
                >
                  <Flex
                    width="100%"
                    flexDirection="column"
                    marginBottom={{ base: 'unset', sm: '33px' }}
                  >
                    {amountField}
                    {selectedAssetField}
                    <StacksRecipientField />
                    <MemoField />
                    <Box mt="space.04" width="100%">
                      <FeesRow fees={fees} isSponsored={false} />
                    </Box>
                    <Link
                      alignSelf="flex-end"
                      mt="space.04"
                      onClick={() => navigate(RouteUrls.EditNonce)}
                    >
                      Edit nonce
                    </Link>
                  </Flex>
                </Card>
                <HighFeeSheet learnMoreUrl={HIGH_FEE_WARNING_LEARN_MORE_URL_STX} />
                <Outlet />
              </Form>
            </>
          );
        }}
      </Formik>
    </Page>
  );
}
