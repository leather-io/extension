import { Stack } from 'leather-styles/jsx';

import { PopupHeader } from '@app/features/container/headers/popup.header';

import { PageTop } from './page-top';

interface ProfileUpdateRequestLayoutProps {
  children: React.ReactNode;
}
export function ProfileUpdateRequestLayout({ children }: ProfileUpdateRequestLayoutProps) {
  return (
    <>
      <PopupHeader showSwitchAccount balance="all" />
      <Stack
        bg="ink.background-primary"
        px={['space.05', 'space.05', 'unset']}
        gap="space.05"
        width="100%"
      >
        <PageTop />
        {children}
      </Stack>
    </>
  );
}
