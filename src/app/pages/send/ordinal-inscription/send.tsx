import { useNavigate } from 'react-router-dom';

import { Box, Button, Flex, Stack } from '@stacks/ui';
import { Form, useFormikContext } from 'formik';

import { RouteUrls } from '@shared/route-urls';

import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { OrdinalIcon } from '@app/components/icons/ordinal-icon';

import { FormErrors } from '../send-crypto-asset-form/components/form-errors';
import { FormFieldsLayout } from '../send-crypto-asset-form/components/form-fields.layout';
import { RecipientField } from '../send-crypto-asset-form/components/recipient-field';
import { CollectibleAsset } from './components/collectible-asset';
import { Image } from './components/image';
import { Metadata } from './components/metadata';
import { useSendOrdinalInscriptionRouteState } from './use-send-ordinal-inscription-route-state';

export const recipeintFieldName = 'recipient';

export function Send() {
  const navigate = useNavigate();
  const inscription = useSendOrdinalInscriptionRouteState();

  const formikContext = useFormikContext();

  console.log('ARY errors', formikContext.errors);

  return (
    <BaseDrawer title="Send" isShowing onClose={() => navigate('../..')}>
      <Box px="extra-loose">
        <Stack pb="extra-loose" alignItems="center" spacing="loose" textAlign="center">
          <Box
            border="1px solid"
            borderColor="#DCDDE2"
            borderRadius="16px"
            flexDirection="column"
            mt="loose"
            width="100%"
          >
            <Flex p="base" columnGap="16px">
              <Image inscription={inscription} />
              <Metadata inscription={inscription} />
            </Flex>
          </Box>
          <Form style={{ width: '100%' }}>
            <FormFieldsLayout>
              <CollectibleAsset icon={<OrdinalIcon />} name="Ordinal inscription" />
              <RecipientField lastChild name={recipeintFieldName} placeholder="Address or name" />
            </FormFieldsLayout>
            <FormErrors />
          </Form>
          <Button
            width="100%"
            onClick={() => {
              navigate(RouteUrls.SendOrdinalInscriptionReview, { state: inscription });
            }}
            isDisabled={
              (!formikContext.isValid && Boolean(formikContext.touched)) || !formikContext.dirty
            }
          >
            Continue
          </Button>
        </Stack>
      </Box>
    </BaseDrawer>
  );
}
