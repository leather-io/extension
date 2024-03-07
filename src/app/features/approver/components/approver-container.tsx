import { css } from 'leather-styles/css';
import { Flex, styled } from 'leather-styles/jsx';

import type { HasChildren } from '@app/common/has-children';

import {
  childElementInitialAnimationState,
  useApproverChildrenEntryAnimation,
} from '../approver-animation';

const applyMarginsToLastApproverSection = css({
  '& .approver-section:last-child': { mb: 'space.03' },
});

export function ApproverContainer({ children }: HasChildren) {
  const scope = useApproverChildrenEntryAnimation();

  return (
    <styled.main
      display="flex"
      flexDir="column"
      pos="relative"
      minH="100%"
      maxW="640px"
      mx="auto"
      className={applyMarginsToLastApproverSection}
      alignItems="center"
      boxShadow="0px 12px 24px 0px rgba(18, 16, 15, 0.08), 0px 4px 8px 0px rgba(18, 16, 15, 0.08), 0px 0px 2px 0px rgba(18, 16, 15, 0.08)"
    >
      <Flex
        className={childElementInitialAnimationState}
        ref={scope}
        flexDir="column"
        flex={1}
        background="ink.background-secondary"
      >
        {children}
      </Flex>
    </styled.main>
  );
}
