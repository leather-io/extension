import React, { useState } from 'react';
import { Box, InputGroup, Input, FormLabel, Text, Button } from '@blockstack/ui';
import { Formik } from 'formik';
import { PopupContainer } from '@components/popup/container';
import { ConfirmSendDrawer } from '@components/drawer/confirm-send-drawer';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';

export const PopupSend: React.FC = () => {
  const { doChangeScreen } = useAnalytics();
  const [isShowing, setShowing] = useState(false);
  return (
    <Formik initialValues={{ amount: 0, recipient: '' }} onSubmit={() => console.log('submit')}>
      {({ handleSubmit, values, handleChange }) => (
        <>
          <ConfirmSendDrawer
            close={() => {
              setShowing(false);
              console.log('closed');
            }}
            amount={values.amount}
            recipient={values.recipient}
            showing={isShowing}
          />
          <PopupContainer title="Send" onClose={() => doChangeScreen(ScreenPaths.POPUP_HOME)}>
            <form onSubmit={handleSubmit}>
              <Box width="100%" mt="extra-loose">
                <InputGroup flexDirection="column">
                  <FormLabel display="block" mb="extra-tight" htmlFor="amount">
                    Amount
                  </FormLabel>
                  <Input
                    display="block"
                    type="number"
                    width="100%"
                    placeholder="0.0 STX"
                    value={values.amount}
                    onChange={handleChange}
                    name="amount"
                  />
                </InputGroup>
              </Box>
              <Box width="100%" mt="base">
                <InputGroup flexDirection="column">
                  <FormLabel display="block" mb="extra-tight" htmlFor="recipient">
                    Send To
                  </FormLabel>
                  <Input
                    display="block"
                    type="string"
                    width="100%"
                    name="recipient"
                    value={values.recipient}
                    onChange={handleChange}
                    placeholder="Enter an Address"
                  />
                </InputGroup>
              </Box>
              <Box width="100%" mt="extra-loose">
                <Text fontWeight={400} color="ink.600" fontSize={1}>
                  <Text>Fee</Text>
                  <Text style={{ float: 'right' }}>0.048 STX</Text>
                </Text>
              </Box>
              <Box mt="base">
                <Button width="100%" onClick={() => setShowing(true)}>
                  Preview
                </Button>
              </Box>
            </form>
          </PopupContainer>
        </>
      )}
    </Formik>
  );
};
