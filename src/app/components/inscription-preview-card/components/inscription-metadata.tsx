import { Flex, color } from '@stacks/ui';

import { Text } from '@app/components/typography';

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
      <Text fontSize={2} fontWeight="500">
        {title}
      </Text>
      <Text color={color('text-caption')} fontSize={1}>
        {subtitle}
      </Text>
      {action ? (
        <Text
          _hover={{ cursor: 'pointer', textDecoration: 'underline' }}
          as="button"
          color={color('accent')}
          fontSize={1}
          onClick={() => action()}
          type="button"
        >
          {actionLabel}
        </Text>
      ) : null}
    </Flex>
  );
}
