import { useRef, useState } from 'react';

import { Title } from '@leather.io/ui';

import { useOnResizeListener } from '@app/common/hooks/use-on-resize-listener';
import { useSpamFilterWithWhitelist } from '@app/common/spam-filter/use-spam-filter';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

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

  const spamFilter = useSpamFilterWithWhitelist();

  useOnResizeListener(onResize);

  return (
    <BasicTooltip disabled={!isEllipsisActive} label={title} side="top">
      <Title
        overflow="hidden"
        ref={ref}
        textOverflow="ellipsis"
        textStyle="label.02"
        whiteSpace="nowrap"
      >
        {spamFilter(title)}
      </Title>
    </BasicTooltip>
  );
}
