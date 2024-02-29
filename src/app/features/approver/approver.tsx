import { useState } from 'react';

import { css } from 'leather-styles/css';
import { Flex, styled } from 'leather-styles/jsx';

import type { HasChildren } from '@app/common/has-children';

import { ApproverProvider } from './approver.context';
import { ApproverActions } from './components/approver-actions';
import { ApproverAdvanced } from './components/approver-advanced';
import { ApproverHeader } from './components/approver-header';
import { ApproverSection } from './components/approver-section';
import { ApproverSubheader } from './components/approver-subheader';

const applyMarginsToLastApproverSection = css({
  '& .approver-section:last-child': { mb: 'space.03' },
});

function Approver({ children }: HasChildren) {
  const [isDisplayingAdvancedView, setIsDisplayingAdvancedView] = useState(false);

  return (
    <ApproverProvider value={{ isDisplayingAdvancedView, setIsDisplayingAdvancedView }}>
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
        <Flex flexDir="column" flex={1} background="ink.background-secondary">
          {children}
        </Flex>
      </styled.main>
    </ApproverProvider>
  );
}

Approver.Header = ApproverHeader;
Approver.Subheader = ApproverSubheader;
Approver.Section = ApproverSection;
Approver.Advanced = ApproverAdvanced;
Approver.Actions = ApproverActions;

export { Approver };
