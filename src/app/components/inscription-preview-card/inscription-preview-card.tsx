import { figmaTheme } from '@app/common/utils/figma-theme';

import { Flag } from '../layout/flag';
import { InscriptionMetadata } from './components/inscription-metadata';

interface InscriptionPreviewCardProps {
  action?(): void;
  actionLabel?: string;
  hideBorder?: boolean;
  icon?: React.JSX.Element;
  image: React.JSX.Element;
  subtitle: string;
  title: string;
}
export function InscriptionPreviewCard({
  action,
  actionLabel,
  hideBorder,
  icon,
  image,
  subtitle,
  title,
}: InscriptionPreviewCardProps) {
  return (
    <Flag
      align="middle"
      border={hideBorder ? 'unset' : '1px solid'}
      borderColor={hideBorder ? 'unset' : figmaTheme.border}
      borderRadius={hideBorder ? 'unset' : '10px'}
      img={image}
      p={hideBorder ? 'unset' : 'base'}
      spacing="base"
    >
      <InscriptionMetadata
        action={action}
        actionLabel={actionLabel}
        icon={icon}
        subtitle={subtitle}
        title={title}
      />
    </Flag>
  );
}
