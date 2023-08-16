import { Flex, styled } from 'leaf-styles/jsx';

import { LeatherButton } from '@app/components/button/button';

import AccessibleIcon from './accessible-icon';

interface ActionButtonProps extends React.ComponentProps<typeof LeatherButton> {
  icon: React.ReactNode;
  label: string;
}

export function ActionButton({ icon, label, ...rest }: ActionButtonProps) {
  return (
    <LeatherButton
      variant="ghost"
      key={label}
      width={['1/4', '', 'unset']}
      textStyle="label.03"
      {...rest}
    >
      <Flex gap="space.02" direction="column" align="center">
        <AccessibleIcon label={label}>{icon}</AccessibleIcon>
        <styled.span px="space.02">{label}</styled.span>
      </Flex>
    </LeatherButton>
  );
}
