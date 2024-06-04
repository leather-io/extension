import { ErrorCircleIcon, Flag, type FlagProps } from '@leather-wallet/ui';

export function ErrorLabel({ children, ...rest }: FlagProps) {
  return (
    <Flag
      img={<ErrorCircleIcon variant="small" />}
      spacing="space.02"
      color="red.action-primary-default"
      textStyle="body.02"
      textAlign="left"
      {...rest}
    >
      {children}
    </Flag>
  );
}
