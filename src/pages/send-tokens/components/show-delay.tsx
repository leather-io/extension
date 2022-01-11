import { useEffect } from 'react';

import {
  useLocalTransactionInputsState,
  useUnsignedTxForSettingsState,
} from '@store/transactions/transaction.hooks';
import { LoadingKeys, useLoading } from '@common/hooks/use-loading';

interface ShowDelayProps {
  setShowing: (value: boolean) => void;
  beginShow: boolean;
  isShowing: boolean;
}
export const ShowDelay = ({ setShowing, beginShow, isShowing }: ShowDelayProps) => {
  const [tx] = useUnsignedTxForSettingsState();
  const [txData] = useLocalTransactionInputsState();
  const { setIsIdle } = useLoading(LoadingKeys.SEND_TOKENS_FORM);
  useEffect(() => {
    if (beginShow && tx && !isShowing && txData) {
      setShowing(true);
      setIsIdle();
    }
  }, [beginShow, tx, setShowing, txData, isShowing, setIsIdle]);

  return null;
};
