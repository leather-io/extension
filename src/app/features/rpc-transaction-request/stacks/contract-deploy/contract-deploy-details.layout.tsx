import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Stack, styled } from 'leather-styles/jsx';

import { AddressDisplayer, Approver, Highlighter } from '@leather.io/ui';

import { Prism } from '@app/common/clarity-prism';

interface ContractDeployDetailsLayoutProps {
  address: string;
  contractName: string;
  codeBody: string;
}
export function ContractDeployDetailsLayout({
  address,
  contractName,
  codeBody,
}: ContractDeployDetailsLayoutProps) {
  return (
    <>
      <Approver.Section>
        <Approver.Subheader>
          <styled.span textStyle="label.01">Contract</styled.span>
        </Approver.Subheader>
        <Stack gap="space.04">
          <Stack gap="space.02">
            <styled.span color="ink.text-subdued" textStyle="caption.01">
              Address
            </styled.span>
            <AddressDisplayer
              data-testid={SharedComponentsSelectors.AddressDisplayer}
              address={address}
            />
          </Stack>
          <Stack gap="space.02">
            <styled.span color="ink.text-subdued" textStyle="caption.01">
              Contract name
            </styled.span>
            <styled.span textStyle="label.01">{contractName}</styled.span>
          </Stack>
        </Stack>
      </Approver.Section>
      <Approver.Section>
        <Approver.Subheader>
          <styled.span textStyle="label.01">Code</styled.span>
        </Approver.Subheader>
        <Highlighter code={codeBody} prism={Prism} language="clarity" />
      </Approver.Section>
    </>
  );
}
