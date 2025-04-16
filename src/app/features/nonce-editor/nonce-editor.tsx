import { Center, styled } from 'leather-styles/jsx';

import { Approver, Button } from '@leather.io/ui';

import { useOnMount } from '@app/common/hooks/use-on-mount';

import { useNonceEditorContext } from './nonce-editor.context';
import { NonceInput } from './nonce-input';
import { NonceItem } from './nonce-item';

function NonceEditor() {
  const { nonce, loadedNonce, onGoBack, onSetLoadedNonce, onSetNonce } = useNonceEditorContext();

  useOnMount(() => {
    onSetLoadedNonce(nonce);
  });

  function onCancel() {
    onSetNonce(loadedNonce);
    onGoBack();
  }

  function onSave() {
    onSetNonce(nonce);
    onGoBack();
  }

  return (
    <Approver height="100%" width="100%" requester={origin}>
      <Approver.Section mt="0" py="space.05">
        <Center>
          <styled.span textStyle="heading.05">Edit nonce</styled.span>
        </Center>
      </Approver.Section>
      <Approver.Section>
        <NonceInput nonce={nonce} onSetNonce={onSetNonce} />
      </Approver.Section>
      <Approver.Actions
        actions={[
          <Button key="cancel" onClick={onCancel} fullWidth variant="outline">
            Cancel
          </Button>,
          <Button key="save" onClick={onSave} fullWidth>
            Save
          </Button>,
        ]}
      />
    </Approver>
  );
}

NonceEditor.Input = NonceInput;
NonceEditor.Trigger = NonceItem;

export { NonceEditor };
