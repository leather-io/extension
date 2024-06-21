import { styled } from 'leather-styles/jsx';

import { Flag } from '@leather.io/ui';

import { Favicon } from './favicon';

interface RequesterFlagProps {
  requester: string;
}

export function RequesterFlag({ requester }: RequesterFlagProps) {
  return (
    <Flag
      img={<Favicon origin={requester} />}
      align="middle"
      justifyContent="center"
      py="space.04"
      px="space.02"
      borderRadius="sm"
      width="fit-content"
    >
      <styled.span textStyle="label.02">{requester}</styled.span>
    </Flag>
  );
}
