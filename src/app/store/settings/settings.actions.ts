import { useDispatch } from 'react-redux';

import { settingsSlice } from './settings.slice';

export const settingsActions = settingsSlice.actions;

export function useDismissMessage() {
  const dispatch = useDispatch();
  return (messageId: string) => dispatch(settingsActions.messageDismissed(messageId));
}
