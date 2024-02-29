import { createContext, useContext } from 'react';

export type ApproverChildren = 'header' | 'actions' | 'advanced' | 'section' | 'subheader';

interface ApproverContext {
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
