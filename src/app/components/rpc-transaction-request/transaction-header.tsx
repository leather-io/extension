import { styled } from 'leather-styles/jsx';

import { Approver, QuestionCircleIcon } from '@leather.io/ui';

interface TransactionHeaderProps {
  title: string;
  href?: string;
  onPressRequestedByLink(e: React.MouseEvent<HTMLAnchorElement>): void;
}
export function TransactionHeader({
  title,
  href = 'https://leather.io/guides/connect-dapps',
  onPressRequestedByLink,
}: TransactionHeaderProps) {
  return (
    <Approver.Header
      title={title}
      info={
        <styled.a display="block" p="space.01" target="_blank" href={href}>
          <QuestionCircleIcon variant="small" />
        </styled.a>
      }
      onPressRequestedByLink={onPressRequestedByLink}
    />
  );
}
