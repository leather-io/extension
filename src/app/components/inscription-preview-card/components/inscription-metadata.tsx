import { Flex, styled } from 'leather-styles/jsx';

import { Link } from '@leather.io/ui';

interface InscriptionMetadataProps {
  action?(): void;
  actionLabel?: string;
  icon?: React.JSX.Element;
  subtitle: string;
  title: string;
}
export function InscriptionMetadata({
  action,
  actionLabel,
  icon,
  subtitle,
  title,
}: InscriptionMetadataProps) {
  return (
    <Flex alignItems="flex-start" flexDirection="column" justifyContent="center">
      {icon && icon}
      <styled.span textStyle="label.01">{title}</styled.span>
      <styled.span textStyle="caption.01">{subtitle}</styled.span>
      {action ? (
        <Link color="stacks" onClick={() => action()} textStyle="caption.01" variant="text">
          {actionLabel}
        </Link>
      ) : null}
    </Flex>
  );
}
