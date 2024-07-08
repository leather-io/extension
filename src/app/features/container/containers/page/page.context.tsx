import { ReactNode, createContext, useContext, useEffect, useReducer } from 'react';

import { RouteUrls } from '@shared/route-urls';

interface HeaderPayloadState {
  title?: string;
  isSummaryPage?: boolean;
  isSessionLocked?: boolean;
  isSettingsVisibleOnSm?: boolean;
  onBackLocation?: RouteUrls;
  onClose?(): void;
}

interface UpdateAction {
  type: 'update';
  payload: HeaderPayloadState;
}

interface ResetAction {
  type: 'reset';
}
type Action = UpdateAction | ResetAction;

const initialPageState = { isSessionLocked: false, isSettingsVisibleOnSm: true };
const pageReducer = (state: HeaderPayloadState, action: Action): HeaderPayloadState => {
  switch (action.type) {
    case 'update':
      return { ...state, ...action.payload };
    case 'reset':
    default:
      return initialPageState;
  }
};

const PageContext = createContext<
  { state: HeaderPayloadState; dispatch: React.Dispatch<Action> } | undefined
>(undefined);

export function PageProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(pageReducer, initialPageState);
  const value = { state, dispatch };
  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
}

export const usePageContext = () => {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error('usePageContext must be used within a PageProvider');
  }
  return context;
};

export function useUpdatePageHeaderContext(payload: HeaderPayloadState) {
  const { dispatch } = usePageContext();

  useEffect(() => {
    dispatch({ type: 'update', payload });
    return () => {
      dispatch({ type: 'reset' });
    };
  });
}
