import { createContext, useContext } from 'react';

interface ToastContextProps {
  error(message: string): void;
  info(message: string): void;
  success(message: string): void;
  promise(promise: Promise<any>, msgs: { success: string; error: string }): Promise<any>;
}
export const ToastContext = createContext<ToastContextProps | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastsProvider');
  return context;
}
