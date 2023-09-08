import GenericError from '@assets/images/generic-error.png';
import { Flex, styled } from 'leather-styles/jsx';

import { BaseDrawer } from '@app/components/drawer/base-drawer';

import { LeatherButton } from '../button/button';
import { Body, Title } from '../typography';

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
        <Title mt="base-loose">Unable to broadcast transaction</Title>
        <Body mt="space.03" px="space.04">
          Your transaction failed to broadcast{' '}
          {message && <>because of the error: {message.toLowerCase()}</>}
        </Body>
        {/* // #4164 FIXME tertiary */}
        <LeatherButton alignSelf="center" mt="space.05" variant="ghost" onClick={onClose}>
          Close
        </LeatherButton>
      </Flex>
    </BaseDrawer>
  );
}
