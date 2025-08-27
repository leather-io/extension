import { useLocation } from 'react-router';

import { Box } from 'leather-styles/jsx';

import { ExpandIcon } from '@leather.io/ui';

import { analytics } from '@shared/utils/analytics';

import { whenPageMode } from '@app/common/utils';
import { openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';

export function FullScreenButton() {
  const location = useLocation();

  if (window.location.pathname.includes('/popup.html')) return null;

  return whenPageMode({
    full: null,
    popup: (
      <Box
        _hover={{ bg: 'ink.component-background-hover' }}
        _focus={{ outline: 'none' }}
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
      </Box>
    ),
  });
}
