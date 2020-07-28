import { useState, useEffect, useRef } from 'react';

interface UiClipboard {
  value: string;
  onCopy: () => void;
  hasCopied: boolean;
}

/**
 *
 * @param {any} value - The content to add to clipboard
 */
const copyToClipboard = (value: string) => {
  const el = document.createElement('textarea');
  el.value = value;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);

  const curSelection = document.getSelection();
  const selected = curSelection && curSelection.rangeCount > 0 ? curSelection.getRangeAt(0) : false;
  el.select();

  document.execCommand('copy');
  document.body.removeChild(el);
  if (selected) {
    document.getSelection()?.removeAllRanges();
    document.getSelection()?.addRange(selected);
  }
};

export function useClipboard(value: string): UiClipboard {
  const [hasCopied, setHasCopied] = useState(false);
  const timers = useRef<number[]>([]);

  const onCopy = () => {
    copyToClipboard(value);
    setHasCopied(true);
    timers.current.push(setTimeout(() => setHasCopied(false), 1250));
  };

  useEffect(() => () => timers.current.forEach(timer => clearTimeout(timer)), []);

  return { value, onCopy, hasCopied };
}
