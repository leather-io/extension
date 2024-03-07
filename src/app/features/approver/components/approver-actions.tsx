import { css } from 'leather-styles/css';
import { Flex, styled } from 'leather-styles/jsx';

import type { HasChildren } from '@app/common/has-children';

import { ApproverActionsAnimation } from '../approver-animation';
import { useRegisterApproverChild } from '../approver.context';

const stretchChildrenStyles = css({ '& > *': { flex: 1 } });

interface ApproverActionsProps extends HasChildren {
  actions: React.ReactNode;
}
export function ApproverActions({ children, actions }: ApproverActionsProps) {
  useRegisterApproverChild('actions');
  return (
    <styled.footer pos="sticky" mt="auto" bottom={0} className="skip-animation">
      <ApproverActionsAnimation>
        <styled.div background="ink.background-primary" p="space.05">
          {children}
          <Flex width="100%" gap="space.04" className={stretchChildrenStyles}>
            {actions}
          </Flex>
        </styled.div>
      </ApproverActionsAnimation>
    </styled.footer>
  );
}
