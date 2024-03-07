import { createContext, useContext } from 'react';

import { useOnMount } from '@app/common/hooks/use-on-mount';
import { type ChildRegister, useRegisterChildren } from '@app/common/hooks/use-register-children';

type ApproverChildren = 'header' | 'actions' | 'advanced' | 'section' | 'subheader';

interface ApproverContext extends ChildRegister<ApproverChildren> {
  isDisplayingAdvancedView: boolean;
  setIsDisplayingAdvancedView(val: boolean): void;
}

const approverContext = createContext<ApproverContext | null>(null);

export const ApproverProvider = approverContext.Provider;

export function useApproverContext() {
  const context = useContext(approverContext);
  if (!context) throw new Error('`useApproverContext` must be used within a `ApproverProvider`');
  return context;
}

export function useRegisterApproverChildren() {
  return useRegisterChildren<ApproverChildren>();
}

export function useRegisterApproverChild(child: ApproverChildren) {
  const { registerChild, deregisterChild, childCount } = useApproverContext();
  if (childCount.actions > 1) throw new Error('Only one `Approver.Actions` is allowed');
  if (childCount.advanced > 1) throw new Error('Only one `Approver.Advanced` is allowed');
  useOnMount(() => {
    registerChild(child);
    return () => deregisterChild(child);
  });
}
