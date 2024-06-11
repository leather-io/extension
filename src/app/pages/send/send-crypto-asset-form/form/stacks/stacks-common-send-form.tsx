import { Outlet, useNavigate } from 'react-router-dom';

import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import BigNumber from 'bignumber.js';
import { Form, Formik, FormikHelpers } from 'formik';
import { Box } from 'leather-styles/jsx';
import { ObjectSchema } from 'yup';

import {
  HIGH_FEE_AMOUNT_STX,
  HIGH_FEE_WARNING_LEARN_MORE_URL_STX,
} from '@leather-wallet/constants';
import type { Fees, Money } from '@leather-wallet/models';
import { formatMoney } from '@leather-wallet/utils';

import { StacksSendFormValues } from '@shared/models/form.model';
import { RouteUrls } from '@shared/route-urls';

import { FeesRow } from '@app/components/fees-row/fees-row';
import { NonceSetter } from '@app/components/nonce-setter';
import { HighFeeDialog } from '@app/features/dialogs/high-fee-dialog/high-fee-dialog';
import { useUpdatePersistedSendFormValues } from '@app/features/popup-send-form-restoration/use-update-persisted-send-form-values';
import { Button } from '@app/ui/components/button/button';
import { AvailableBalance } from '@app/ui/components/containers/footers/available-balance';
import { Footer } from '@app/ui/components/containers/footers/footer';
import { Link } from '@app/ui/components/link/link';
import { Card } from '@app/ui/layout/card/card';
import { CardContent } from '@app/ui/layout/card/card-content';

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
  fee?: number | string | BigNumber;
}

export function StacksCommonSendForm({
  onSubmit,
  initialValues,
  validationSchema,
  amountField,
  selectedAssetField,
  fees,
  fee,
  availableTokenBalance,
}: StacksCommonSendFormProps) {
  const navigate = useNavigate();
  const { onFormStateChange } = useUpdatePersistedSendFormValues();
  return (
    <Box width="100%" pb="space.04">
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
                  footer={
                    <Footer variant="card">
                      <Button
                        data-testid={SendCryptoAssetSelectors.PreviewSendTxBtn}
                        onClick={() => props.handleSubmit()}
                        type="submit"
                      >
                        Continue
                      </Button>
                      <AvailableBalance balance={formatMoney(availableTokenBalance)} />
                    </Footer>
                  }
                >
                  <CardContent dataTestId={SendCryptoAssetSelectors.SendForm}>
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
                  </CardContent>
                </Card>

                <HighFeeDialog
                  isShowing={new BigNumber(fee as BigNumber.Value).isGreaterThan(
                    HIGH_FEE_AMOUNT_STX
                  )}
                  learnMoreUrl={HIGH_FEE_WARNING_LEARN_MORE_URL_STX}
                />
                <Outlet />
              </Form>
            </>
          );
        }}
      </Formik>
    </Box>
  );
}
