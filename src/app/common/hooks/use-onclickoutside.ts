import { RefObject, useEffect } from 'react';

import arePassiveEventsSupported from 'are-passive-events-supported';
import useLatest from 'use-latest';

const MOUSEDOWN = 'mousedown';
const TOUCHSTART = 'touchstart';

type HandledEvents = [typeof MOUSEDOWN, typeof TOUCHSTART];
type HandledEventsType = HandledEvents[number];
type PossibleEvent = {
  [Type in HandledEventsType]: HTMLElementEventMap[Type];
}[HandledEventsType];
type Handler = (event: PossibleEvent) => void;

const events: HandledEvents = [MOUSEDOWN, TOUCHSTART];

const getOptions = (event: HandledEventsType) => {
  if (event !== TOUCHSTART) {
    return;
  }

  if (arePassiveEventsSupported()) {
    return { passive: true };
  }

  return;
};

export function useOnClickOutside(
  ref: RefObject<HTMLElement | null>,
  handler: Handler | null,
  exceptionIds: string[] = []
) {
  const noHandler = !handler;
  const handlerRef = useLatest(handler);

  useEffect(() => {
    if (noHandler) {
      return;
    }

    const listener = (event: PossibleEvent) => {
      if (!ref.current || !handlerRef.current || ref.current.contains(event.target as Node)) {
        return;
      }

      const clickedElementIsAnException = exceptionIds
        .map(el => document.getElementById(el))
        .some(el => el?.contains(event.target as Node));

      if (clickedElementIsAnException) {
        return;
      }

      handlerRef.current(event);
    };

    events.forEach(event => {
      document.addEventListener(event, listener, getOptions(event));
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, listener, getOptions(event) as EventListenerOptions);
      });
    };
  }, [ref, handlerRef, noHandler, exceptionIds]);
}
