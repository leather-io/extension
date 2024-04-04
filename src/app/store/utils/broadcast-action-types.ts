import { Middleware, isAction } from '@reduxjs/toolkit';

export const broadcastActionTypeToOtherFramesMiddleware: Middleware = _store => next => action => {
  if (isAction(action)) chrome.runtime.sendMessage({ method: action.type });
  return next(action);
};
