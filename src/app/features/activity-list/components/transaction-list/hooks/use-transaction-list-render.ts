import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export function useTransactionListRender({
  currentBitcoinAddress,
}: {
  currentBitcoinAddress: string;
}) {
  const [visibleTxsNum, setVisibleTxsNum] = useState(10);
  const { ref: intersectionSentinel, inView } = useInView({
    rootMargin: '0% 0% 20% 0%',
  });

  useEffect(() => {
    if (inView) {
      setVisibleTxsNum(visibleTxsNum + 10);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    setVisibleTxsNum(10);
  }, [currentBitcoinAddress]);

  return {
    visibleTxsNum,
    intersectionSentinel,
  };
}
