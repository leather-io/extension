import WaxSeal from '@assets/illustrations/wax-seal.png';
import { Flex, styled } from 'leather-styles/jsx';

export function TxDone() {
  return (
    <Flex direction="column" alignItems="center">
      <styled.img src={WaxSeal} width="208px" height="181px" alt="All done" mt="space.04" />
    </Flex>
  );
}
