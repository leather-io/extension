import GenericError from '@assets/images/generic-error.png';
import { Flex, styled } from 'leather-styles/jsx';

import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { LeatherButton } from '@app/ui/components/button';

interface BroadcastErrorDrawerLayoutProps {
  message: string;
  onClose(): void;
}
export function BroadcastErrorDrawerLayout({ message, onClose }: BroadcastErrorDrawerLayoutProps) {
  return (
    <BaseDrawer icon={<></>} isShowing onClose={onClose} textAlign="center">
      <Flex
        flexDirection="column"
        justifyContent="center"
        mx="space.06"
        mb="space.02"
        position="relative"
        top="-24px"
      >
        <styled.img src={GenericError} width="106px" height="72px" m="0 auto" />
        <styled.h1 mt="space.05" textStyle="heading.05">
          Unable to broadcast transaction
        </styled.h1>
        <styled.span mt="space.03" px="space.04" textStyle="body.01">
          Your transaction failed to broadcast{' '}
          {message && <>because of the error: {message.toLowerCase()}</>}
        </styled.span>
        <LeatherButton fullWidth onClick={onClose} mt="space.05">
          Close
        </LeatherButton>
      </Flex>
    </BaseDrawer>
  );
}
