import { useRef, useState } from 'react';

import { useOnResizeListener } from '@app/common/hooks/use-on-resize-listener';
import { spamFilter } from '@app/common/utils/spam-filter';
import { Tooltip } from '@app/components/tooltip';
import { Title } from '@app/components/typography';

interface TransactionTitleProps {
  title: string;
}
export function TransactionTitle(props: TransactionTitleProps) {
  const { title } = props;
  const ref = useRef<HTMLDivElement | null>(null);
  const element = ref.current!;
  const [isEllipsisActive, setIsEllipsisActive] = useState(
    element?.scrollWidth > element?.clientWidth
  );
  const onResize = () => setIsEllipsisActive(element?.scrollWidth > element?.clientWidth);

  useOnResizeListener(onResize);

  return (
    <Tooltip disabled={!isEllipsisActive} label={title} placement="top">
      <Title
        fontWeight="normal"
        overflow="hidden"
        ref={ref}
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {spamFilter(title)}
      </Title>
    </Tooltip>
  );
}
