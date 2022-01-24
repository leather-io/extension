import { AnyAction, Middleware } from '@reduxjs/toolkit';

export const broadcastActionTypeToOtherFramesMiddleware: Middleware =
  _store => next => (action: AnyAction) => {
    chrome.runtime.sendMessage({ method: action.type });
    return next(action);
  };
