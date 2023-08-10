import { memo } from 'react';

import { Text } from '@radix-ui/themes';

import { LButton } from '@app/components/button/button';

// import { ButtonProps } from '@stacks/ui';

interface HomeActionButtonProps extends any {
  icon: any;
  label: string;
  buttonComponent(props: any): React.JSX.Element;
}
export const HomeActionButton = memo((props: HomeActionButtonProps) => {
  const { icon, label, buttonComponent: Button, ...rest } = props;

  return (
    <LButton isLoading={false}>
      <Text>{label}</Text>
    </LButton>
  );
});
