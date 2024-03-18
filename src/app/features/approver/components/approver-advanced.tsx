import { useRef } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Flex } from 'leather-styles/jsx';

import { createDelay } from '@shared/utils';

import type { HasChildren } from '@app/common/has-children';
import { getScrollParent } from '@app/common/utils';
import { Button } from '@app/ui/components/button/button';
import { Flag } from '@app/ui/components/flag/flag';
import { ChevronDownIcon } from '@app/ui/icons';

import { AnimateChangeInHeight } from '../../../components/animate-height';
import { useApproverContext, useRegisterApproverChild } from '../approver.context';

const slightPauseForContentEnterAnimation = createDelay(120);

export function ApproverAdvanced({ children }: HasChildren) {
  const { isDisplayingAdvancedView, setIsDisplayingAdvancedView } = useApproverContext();
  useRegisterApproverChild('advanced');

  const ref = useRef<HTMLButtonElement>(null);

  async function handleToggleAdvancedView() {
    setIsDisplayingAdvancedView(!isDisplayingAdvancedView);
    if (ref.current && !isDisplayingAdvancedView) {
      await slightPauseForContentEnterAnimation();
      const scrollPosition = ref.current.offsetTop;
      const scrollParent = getScrollParent(ref.current);
      scrollParent?.parentElement?.scroll({ top: scrollPosition, behavior: 'smooth' });
    }
  }

  return (
    <>
      <Button
        ref={ref}
        variant="ghost"
        textAlign="left"
        mt="space.03"
        mb={!isDisplayingAdvancedView ? 'space.03' : 0}
        px="space.05"
        onClick={handleToggleAdvancedView}
      >
        <Flag img={<ChevronDownIcon variant="small" />} reverse>
          {isDisplayingAdvancedView ? 'Hide' : 'Show'} advanced details
        </Flag>
      </Button>
      <AnimateChangeInHeight>
        <Flex justifyContent="center" flexDir="column">
          <AnimatePresence>
            {isDisplayingAdvancedView && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </Flex>
      </AnimateChangeInHeight>
    </>
  );
}
