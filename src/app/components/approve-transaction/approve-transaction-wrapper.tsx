import { motion, useAnimationControls } from 'framer-motion';
import { Box, Flex, Stack } from 'leather-styles/jsx';

import { LeatherLogomarkIcon } from '@leather.io/ui';

import { BackgroundOverlay } from '@app/components/loading-overlay';

interface ApproveTransactionWrapperProps {
  children: React.ReactNode;
  showOverlay?: boolean;
}

export function ApproveTransactionWrapper({
  children,
  showOverlay = false,
}: ApproveTransactionWrapperProps) {
  const originLogoAnimation = useAnimationControls();
  const checkmarkEnters = useAnimationControls();

  return (
    <Flex
      flexDir="column"
      minH="100vh"
      background="ink.background-secondary"
      boxShadow="0px 0px 2px 0px rgba(18, 16, 15, 0.08), 0px 4px 8px 0px rgba(18, 16, 15, 0.08), 0px 12px 24px 0px rgba(18, 16, 15, 0.08)"
    >
      <Stack position="relative">
        <BackgroundOverlay show={showOverlay} />

        <Box mx="space.05" mt="space.05" mb="space.05" height={18} width={86}>
          <LeatherLogomarkIcon height={18} width={86} />
        </Box>
        <Flex zIndex={0}>
          <motion.div style={{ display: 'inline-block', zIndex: 1 }} animate={originLogoAnimation}>
            <motion.img
              animate={checkmarkEnters}
              style={{ position: 'absolute', zIndex: 1, top: '50%', left: '50%' }}
              initial={{ scale: 0 }}
              src="assets/illustrations/black-circle-checkmark.svg"
            />
          </motion.div>
        </Flex>
      </Stack>
      {children}
    </Flex>
  );
}
