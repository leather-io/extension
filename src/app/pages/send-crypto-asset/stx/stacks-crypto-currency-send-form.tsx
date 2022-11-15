import { Input } from '@stacks/ui';
import { Form, Formik } from 'formik';

interface StacksCryptoCurrencySendFormProps {}
export function StacksCryptoCurrencySendForm({}: StacksCryptoCurrencySendFormProps) {
  const initialValues = {
    amount: null,
    recipient: null,
    fee: null,
  };

  function onSubmit() {}

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      <Form>
        <legend>BTC Send Form</legend>
        <fieldset>
          <label>
            Amount
            <Input type="number" />
          </label>
          <label>
            Recipient
            <Input type="text" />
          </label>
          <label>
            Fee (in µSTX)
            <Input type="number" />
          </label>
        </fieldset>
        <button>Send STX</button>
      </Form>
    </Formik>
  );
}
