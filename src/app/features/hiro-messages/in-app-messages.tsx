import { useLocation } from 'react-router-dom';

import { Flex, FlexProps } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { useRemoteLeatherMessages } from '@app/query/common/remote-config/remote-config.query';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';
import { useDismissMessage } from '@app/store/settings/settings.actions';
import { useDismissedMessageIds } from '@app/store/settings/settings.selectors';

import { HiroMessageItem } from './components/in-app-message-item';

export function InAppMessages(props: FlexProps) {
  const location = useLocation();
  const messages = useRemoteLeatherMessages();

  const { chain } = useCurrentNetworkState();
  const dismissMessage = useDismissMessage();
  const dismissedIds = useDismissedMessageIds();

  if (location.pathname !== RouteUrls.Home || messages.length === 0) return null;

  const firstMessage = messages.filter(msg => !dismissedIds.includes(msg.id))[0];

  if (!firstMessage) return null;

  if (firstMessage.chainTarget !== 'all' && firstMessage.chainTarget !== chain.bitcoin.mode) {
    return null;
  }

  return (
    <Flex bg="ink.text-non-interactive" {...props}>
      <HiroMessageItem onDismiss={messageId => dismissMessage(messageId)} {...firstMessage} />
    </Flex>
  );
}
