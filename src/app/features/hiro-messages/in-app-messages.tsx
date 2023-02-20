import { Flex, FlexProps } from '@stacks/ui';

import { useRemoteHiroMessages } from '@app/query/common/hiro-config/hiro-config.query';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';
import { useDismissMessage } from '@app/store/settings/settings.actions';
import { useDismissedMessageIds } from '@app/store/settings/settings.selectors';

import { HiroMessageItem } from './components/in-app-message-item';

export function InAppMessages(props: FlexProps) {
  const messages = useRemoteHiroMessages();

  const { mode } = useCurrentNetworkState();
  const dismissMessage = useDismissMessage();
  const dismissedIds = useDismissedMessageIds();

  if (!messages || messages?.length === 0) return null;

  const firstMessage = messages.filter(msg => !dismissedIds.includes(msg.id))[0];

  if (!firstMessage) return null;

  if (firstMessage.chainTarget !== 'all' && firstMessage.chainTarget !== mode) {
    return null;
  }

  return (
    <Flex background="#242629" color="white" {...props}>
      <HiroMessageItem onDismiss={messageId => dismissMessage(messageId)} {...firstMessage} />
    </Flex>
  );
}
