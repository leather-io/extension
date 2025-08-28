import { useLocation } from 'react-router';

import { ExpandIcon, IconButton, Tooltip } from '@leather.io/ui';

import { analytics } from '@shared/utils/analytics';

import { whenPageMode } from '@app/common/utils';
import { openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';

const nonInvasiveExplainerHoverDelay = 850;

export function FullScreenButton() {
  const location = useLocation();

  if (window.location.pathname.includes('/popup.html')) return null;

  return whenPageMode({
    full: null,
    popup: (
      <Tooltip.Root delayDuration={nonInvasiveExplainerHoverDelay}>
        <Tooltip.Trigger>
          <IconButton
            aria-label="Open in full screen"
            icon={<ExpandIcon />}
            _hover={{ bg: 'ink.component-background-hover' }}
            _focusVisible={{ outline: 'none' }}
            height="40px"
            p="space.02"
            onClick={() => {
              void analytics.untypedTrack('click_open_in_new_tab', {
                location: 'header',
              });
              void analytics.identify(undefined, { hasVisitedFullPageMode: true });
              openIndexPageInNewTab(location.pathname);
            }}
          >
            <ExpandIcon />
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content side="left">
          <Tooltip.Arrow />
          Open in full screen
        </Tooltip.Content>
      </Tooltip.Root>
    ),
  });
}
