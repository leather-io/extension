import { useMediaQuery } from '@stacks/ui';

import { DESKTOP_VIEWPORT_MIN_WIDTH } from '@app/components/global-styles/full-page-styles';

import { StepFullPage } from './step-full-page';
import { StepPopup } from './step-popup';

export const externalLinkInfo =
  'This link will take you to an external third-party website that is not affiliated with Hiro Systems PBC.';

interface StepIllustrationProps {
  image: string;
}
export const StepIllustration = ({ image }: StepIllustrationProps) => <img src={image} />;

interface SuggestedFirstStepProps {
  action: string;
  body: string;
  imageFull: string;
  imageFullDone: string;
  imagePopup: string;
  imagePopupDone: string;
  isComplete: boolean;
  isExternalRoute?: boolean;
  onClick(): void;
  title: string;
}
export function SuggestedFirstStep(props: SuggestedFirstStepProps) {
  const [desktopViewport] = useMediaQuery(`(min-width: ${DESKTOP_VIEWPORT_MIN_WIDTH})`);

  return desktopViewport ? <StepFullPage {...props} /> : <StepPopup {...props} />;
}
