import type { ReactNode } from 'react';

import { Box, styled } from 'leather-styles/jsx';

import { isString } from '@shared/utils';

import { Favicon } from '@app/components/favicon';
import { Flag } from '@app/ui/components/flag/flag';

import { ApproverHeaderAnimation } from '../approver-animation';
import { useRegisterApproverChild } from '../approver.context';

interface ApproverHeaderProps {
  title: ReactNode;
  requester: ReactNode;
  iconTooltip?: ReactNode;
}
export function ApproverHeader({ title, requester, iconTooltip }: ApproverHeaderProps) {
  useRegisterApproverChild('header');
  return (
    <styled.header p="space.05" className="skip-animation" pos="relative">
      <ApproverHeaderAnimation>
        <styled.h1 textStyle="heading.03" mr={iconTooltip ? 'space.06' : ''}>
          {title}
        </styled.h1>
      </ApproverHeaderAnimation>
      <ApproverHeaderAnimation delay={0.04}>
        <Flag
          mt="space.03"
          textStyle="label.03"
          img={isString(requester) ? <Favicon origin={requester} /> : requester}
        >
          Requested by {requester}
        </Flag>
      </ApproverHeaderAnimation>
      {iconTooltip && (
        <Box pos="absolute" top="space.05" right="space.05" mt="space.01">
          {iconTooltip}
        </Box>
      )}
    </styled.header>
  );
}
