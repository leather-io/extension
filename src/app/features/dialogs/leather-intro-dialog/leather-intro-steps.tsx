import { useLayoutEffect, useRef, useState } from 'react';
import Confetti from 'react-dom-confetti';

import { Dialog, Inset } from '@radix-ui/themes';
import { css } from 'leather-styles/css';
import { Box, Flex, Stack, styled } from 'leather-styles/jsx';

import { Button } from '@leather.io/ui';

import { HasChildren } from '@app/common/has-children';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';

import { confettiConfig } from './confetti-config';
import { useLeatherIntroSheetContext } from './leather-intro-dialog';

export function LeatherIntroSheet({ children }: HasChildren) {
  return (
    <Dialog.Root defaultOpen>
      <Dialog.Content
        // Prevent immediate closing, force interaction
        onEscapeKeyDown={e => e.preventDefault()}
        onInteractOutside={e => e.preventDefault()}
        className={css({ maxWidth: '500px', backgroundColor: 'ink.background-primary' })}
      >
        {children}
      </Dialog.Content>
    </Dialog.Root>
  );
}

export function LeatherIntroSheetPart1() {
  const context = useLeatherIntroSheetContext();
  const [showConfetti, setShowConfetti] = useState(false);

  return (
    <>
      <Box data-confetti pos="absolute" left={0} top={0} right={0} bottom={0} mt="space.01">
        <Box position="relative" left="50%" top="30%">
          <Confetti active={showConfetti} config={confettiConfig} />
        </Box>
      </Box>

      <Box position="relative" zIndex={9}>
        <styled.img
          alt="Cool brand sticks conforming to Hiro Wallet's new brand"
          src="assets/illustrations/layered-diamond-coin.png"
          w="270px"
          h="236px"
        />
        <styled.h1 textStyle="heading.02" mt="space.03">
          Hiro wallet is rebranding
        </styled.h1>
        <styled.p textStyle="heading.05" mt="24px" mr="20px">
          We're excited to share some big news with our valued users. Our beloved Hiro Wallet has
          evolved into something even more incredible
        </styled.p>
        <Flex mt="48px">
          <Button
            onClick={() => {
              context.onRevealNewName();
              setShowConfetti(true);
            }}
          >
            {!showConfetti ? 'Click to reveal our new name' : 'Introducing…'}
          </Button>
        </Flex>
      </Box>
    </>
  );
}

export function LeatherIntroSheetPart2() {
  const ref = useRef<HTMLVideoElement>(null);
  const context = useLeatherIntroSheetContext();

  useLayoutEffect(() => {
    if (ref.current) ref.current.playbackRate = 0.65;
  }, [ref]);

  return (
    <Box>
      <styled.h1 textStyle="heading.02">Say hello to</styled.h1>

      <Box height="286px" mt="48px" filter="invert()">
        <Inset>
          <video ref={ref} src="assets/video/animated-leather-logo.mp4" autoPlay muted />
        </Inset>
      </Box>
      <Box mt="24px">
        We're excited to introduce Leather, a new brand with one mission in mind: driving the global
        transition to a digital economy built on Bitcoin.{' '}
        <styled.a
          href="https://leather.io/blog/leather-wallet-brand-launch"
          textDecoration="underline"
          onClick={e => {
            e.preventDefault();
            openInNewTab('https://leather.io/blog/leather-wallet-brand-launch');
          }}
        >
          Learn more →
        </styled.a>
      </Box>
      <styled.span textStyle="caption.01" display="block" textAlign="left" mt="16px">
        Leather Wallet will now be provided by Leather Wallet LLC [a subsidiary of Nassau Machines
        Inc]. Please review and accept Leather Wallet{' '}
        <styled.a href="https://leather.io/terms" textDecoration="underline" target="_blank">
          Terms of Service
        </styled.a>{' '}
        and{' '}
        <styled.a
          href="https://leather.io/privacy-policy"
          target="_blank"
          textDecoration="underline"
        >
          Privacy Policy
        </styled.a>
        .
      </styled.span>
      <Stack gap="16px" mt="space.05">
        <Button onClick={context.onAcceptTerms}>Accept new terms</Button>
        <Button onClick={context.onRejectAndUninstall} variant="outline">
          Refuse and uninstall
        </Button>
      </Stack>
    </Box>
  );
}
