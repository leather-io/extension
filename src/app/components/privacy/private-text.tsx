import { type HTMLStyledProps } from 'leather-styles/jsx';

import { PrivateTextLayout } from '@app/components/privacy/private-text.layout';
import { useTogglePrivateMode } from '@app/store/settings/settings.actions';
import { useIsPrivateMode } from '@app/store/settings/settings.selectors';

interface PrivateTextProps extends HTMLStyledProps<'span'> {
  children: React.ReactNode;
  canClickToShow?: boolean;
}

export function PrivateText({ children, canClickToShow, ...rest }: PrivateTextProps) {
  const isPrivateMode = useIsPrivateMode();
  const togglePrivateMode = useTogglePrivateMode();

  return (
    <PrivateTextLayout
      {...rest}
      isPrivate={isPrivateMode}
      onShowValue={canClickToShow ? togglePrivateMode : undefined}
    >
      {children}
    </PrivateTextLayout>
  );
}
