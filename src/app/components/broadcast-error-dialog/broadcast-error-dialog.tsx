import { useLocation, useNavigate } from 'react-router-dom';

import GenericError from '@assets/images/generic-error.png';
import { Flex, styled } from 'leather-styles/jsx';
import get from 'lodash.get';

import { Button } from '@app/ui/components/button/button';
import { Dialog } from '@app/ui/components/containers/dialog/dialog';

export function BroadcastErrorDialog() {
  const navigate = useNavigate();
  const location = useLocation();
  const message = get(location.state, 'message', '');

  return (
    <Dialog isShowing onClose={() => navigate('..')}>
      <Flex
        flexDirection="column"
        justifyContent="center"
        mx="space.06"
        mb="space.02"
        position="relative"
        top="-24px"
        textAlign="center"
      >
        <styled.img src={GenericError} width="106px" height="72px" m="0 auto" />
        <styled.h1 mt="space.05" textStyle="heading.05">
          Unable to broadcast transaction
        </styled.h1>
        <styled.span mt="space.03" px="space.04" textStyle="body.01">
          Your transaction failed to broadcast{' '}
          {message && <>because of the error: {message.toLowerCase()}</>}
        </styled.span>
        <Button fullWidth onClick={() => navigate('..')} mt="space.05">
          Close
        </Button>
      </Flex>
    </Dialog>
  );
}
