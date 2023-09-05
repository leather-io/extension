import { styled } from 'leather-styles/jsx';

import { Favicon } from './favicon';
import { Flag } from './layout/flag';

interface RequesterFlagProps {
  requester: string;
}

export function RequesterFlag({ requester }: RequesterFlagProps) {
  return (
    <Flag
      img={<Favicon origin={requester} />}
      alignItems="center"
      justifyContent="center"
      py="extra-tight"
      px="tight"
      borderRadius="10px"
      width="fit-content"
    >
      <styled.span textStyle="label.02">{requester}</styled.span>
    </Flag>
  );
}
