import type { ReactNode } from 'react';

import { motion, useAnimationControls } from 'framer-motion';
import { Box, Flex, VStack, styled } from 'leather-styles/jsx';

import {
  Approver,
  Button,
  CheckmarkIcon,
  Flag,
  LeatherLogomarkIcon,
  QuestionCircleIcon,
} from '@leather.io/ui';
import { delay } from '@leather.io/utils';

import { closeWindow } from '@shared/utils';

import { useOnMount } from '@app/common/hooks/use-on-mount';
import { FaviconDisplayer } from '@app/components/favicon-displayer/favicon-displayer';

interface ConnectAccountLayoutProps {
  requester: string;
  switchAccount: ReactNode;
  onBeforeAnimation?(): void;
  onUserApprovesGetAddresses(): void | Promise<void>;
  onClickRequestedByLink(): void;
}
export function ConnectAccountLayout({
  requester,
  switchAccount,
  onBeforeAnimation,
  onUserApprovesGetAddresses,
  onClickRequestedByLink,
}: ConnectAccountLayoutProps) {
  const originLogoAnimation = useAnimationControls();
  const contentDisappears = useAnimationControls();
  const checkmarkEnters = useAnimationControls();

  useOnMount(() => {
    // Force background, only visible when resized
    if (document.body && document.body.parentElement) {
      document.body.parentElement.style.background =
        'var(--leather-colors-ink-background-secondary)';
    }
  });

  async function userApprovesGetAddresses() {
    onBeforeAnimation?.();
    const yPos = window.innerHeight / 2 - 100;
    const xPos = Math.min(window.innerWidth / 2, 320) - 84;
    await contentDisappears.start({
      opacity: 0,
      transition: { duration: 0.4 },
      pointerEvents: 'none',
    });
    await originLogoAnimation.start({
      x: xPos,
      y: yPos,
      scale: 1.4,
      rotate: -20,
    });
    await checkmarkEnters.start({ scale: 0.5, dur: 0.32 });
    await delay(280);
    await onUserApprovesGetAddresses();
    await delay(280);
    await originLogoAnimation.start({
      scale: 0,
      opacity: 0,
      dur: 0.004,
    });
    closeWindow();
  }

  return (
    <Flex
      flexDir="column"
      minH="100vh"
      background="ink.background-secondary"
      boxShadow="0px 0px 2px 0px rgba(18, 16, 15, 0.08), 0px 4px 8px 0px rgba(18, 16, 15, 0.08), 0px 12px 24px 0px rgba(18, 16, 15, 0.08)"
    >
      <Box mx="space.05" mt="space.05" height={18} width={86}>
        <LeatherLogomarkIcon height={18} width={86} />
      </Box>
      <Flex zIndex={0}>
        <motion.div style={{ display: 'inline-block', zIndex: 1 }} animate={originLogoAnimation}>
          <Box mx="space.05" mt="space.05">
            <FaviconDisplayer requester={requester} />
          </Box>
          <motion.img
            animate={checkmarkEnters}
            style={{ position: 'absolute', zIndex: 1, top: '50%', left: '50%' }}
            initial={{ scale: 0 }}
            src="assets/illustrations/black-circle-checkmark.svg"
          />
        </motion.div>
      </Flex>
      <motion.div animate={contentDisappears} style={{ display: 'flex', flex: 1 }}>
        <Approver requester={requester} width="100%" mt="space.01">
          <Approver.Header
            title="Connect app"
            info={
              <styled.a
                display="block"
                p="space.01"
                target="_blank"
                href="https://leather.io/guides/connect-dapps"
              >
                <QuestionCircleIcon variant="small" />
              </styled.a>
            }
            onPressRequestedByLink={e => {
              e.preventDefault();
              onClickRequestedByLink();
            }}
          />
          <Approver.Section>
            <Approver.Subheader>With account</Approver.Subheader>
            <Box mb="space.03">{switchAccount}</Box>
          </Approver.Section>
          <Approver.Section>
            <Approver.Subheader>This app would like to</Approver.Subheader>
            <VStack gap="space.03" pb="space.03">
              {['View your balances and activity', 'Request approval for transactions'].map(
                text => (
                  <Flag key={text} img={<CheckmarkIcon variant="small" />}>
                    <styled.p textStyle="caption.01">{text}</styled.p>
                  </Flag>
                )
              )}
            </VStack>
          </Approver.Section>
          <Approver.Actions
            actions={[
              <Button key="cancel" variant="outline" onClick={() => closeWindow()}>
                Deny
              </Button>,
              <Button
                key="confirm"
                onClick={userApprovesGetAddresses}
                data-testid="get-addresses-approve-button"
              >
                Confirm
              </Button>,
            ]}
          />
        </Approver>
      </motion.div>
    </Flex>
  );
}
