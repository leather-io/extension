import { useState } from 'react';

import type { HasChildren } from '@app/common/has-children';

import { ApproverProvider } from './approver.context';
import { ApproverActions } from './components/approver-actions';
import { ApproverAdvanced } from './components/approver-advanced';
import { ApproverContainer } from './components/approver-container';
import { ApproverHeader } from './components/approver-header';
import { ApproverSection } from './components/approver-section';
import { ApproverSubheader } from './components/approver-subheader';

function Approver(props: HasChildren) {
  const [isDisplayingAdvancedView, setIsDisplayingAdvancedView] = useState(false);

  return (
    <ApproverProvider value={{ isDisplayingAdvancedView, setIsDisplayingAdvancedView }}>
      <ApproverContainer {...props} />
    </ApproverProvider>
  );
}

Approver.Header = ApproverHeader;
Approver.Subheader = ApproverSubheader;
Approver.Section = ApproverSection;
Approver.Advanced = ApproverAdvanced;
Approver.Actions = ApproverActions;

export { Approver };
