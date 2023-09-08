import { Flex, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

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
      <styled.span color={token('colors.accent.text-subdued')} fontSize={1}>
        {subtitle}
      </styled.span>
      {action ? (
        <styled.button
          _hover={{ cursor: 'pointer', textDecoration: 'underline' }}
          color={token('colors.accent.action-primary-default')}
          fontSize={1}
          onClick={() => action()}
          type="button"
        >
          {actionLabel}
        </styled.button>
      ) : null}
    </Flex>
  );
}
