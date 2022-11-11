import { Flex } from '@stacks/ui';
import { Formik } from 'formik';

import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';

import { AmountField } from '../components/amount-field';
import { SendAllButton } from '../components/send-all-button';

interface BitcoinCryptoCurrencySendFormProps {}

export function BitcoinCryptoCurrencySendForm({}: BitcoinCryptoCurrencySendFormProps) {
  return (
    <Formik
      initialValues={{ amount: '' }}
      validateOnChange={false}
      validateOnBlur={false}
      validateOnMount={false}
      // validationSchema={}
      onSubmit={() => {}}
    >
      {() => (
        <Flex
          alignItems="center"
          flexGrow={1}
          flexDirection="column"
          maxWidth={['unset', 'unset', CENTERED_FULL_PAGE_MAX_WIDTH]}
          minHeight={['70vh', '90vh']}
          justifyContent="center"
          mb="loose"
        >
          <AmountField sendAllButton={<SendAllButton />} />
        </Flex>
      )}
    </Formik>
  );
}
