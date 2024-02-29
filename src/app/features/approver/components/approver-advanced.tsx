import { useRef } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Flex } from 'leather-styles/jsx';

import type { HasChildren } from '@app/common/has-children';
import { createDelay } from '@app/common/utils';
import { Button } from '@app/ui/components/button/button';
import { Flag } from '@app/ui/components/flag/flag';
import { ChevronDownIcon } from '@app/ui/icons';

import { useApproverContext } from '../approver.context';
import { AnimateChangeInHeight } from './animate-height';

const slightPauseForContentEnterAnimation = createDelay(120);

export function ApproverAdvanced({ children }: HasChildren) {
  const { isDisplayingAdvancedView, setIsDisplayingAdvancedView } = useApproverContext();

  const ref = useRef<HTMLButtonElement>(null);

  async function handleToggleAdvancedView() {
    setIsDisplayingAdvancedView(!isDisplayingAdvancedView);
    if (ref.current && !isDisplayingAdvancedView) {
      await slightPauseForContentEnterAnimation();
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
