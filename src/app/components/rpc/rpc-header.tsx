import { styled } from 'leather-styles/jsx';

import { Approver, QuestionCircleIcon } from '@leather.io/ui';

interface RpcHeaderProps {
  title: string;
  href?: string;
  onPressRequestedByLink(e: React.MouseEvent<HTMLAnchorElement>): void;
}

export function RpcHeader({
  title,
  href = 'https://leather.io/guides/connect-dapps',
  onPressRequestedByLink,
}: RpcHeaderProps) {
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
