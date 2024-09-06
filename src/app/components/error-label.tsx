import { ErrorCircleIcon, Flag, type FlagProps } from '@leather.io/ui';

export function ErrorLabel({ children, ...rest }: FlagProps) {
  return (
    <Flag
      img={<ErrorCircleIcon color="red.action-primary-default" variant="small" />}
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
