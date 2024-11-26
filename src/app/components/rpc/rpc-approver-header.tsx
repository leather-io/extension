import { styled } from 'leather-styles/jsx';

import { Approver, QuestionCircleIcon } from '@leather.io/ui';

interface RpcApproverHeaderProps {
  title: string;
  info: React.ReactNode;
  onPressRequestedByLink(e: React.MouseEvent<HTMLAnchorElement>): void;
}

export function RpcApproverHeader({ title, info, onPressRequestedByLink }: RpcApproverHeaderProps) {
  return (
    <Approver.Header
      title="Send BTC"
      info={
        <styled.a
          display="block"
          p="space.01"
          target="_blank"
          href="https://leather.io/guides/connect-dapps"
        >
          <QuestionCircleIcon variant="small" />
        </styled.a>
      }
      onPressRequestedByLink={e => {
        e.preventDefault();
        // onClickRequestedByLink();
      }}
    />
  );
}
