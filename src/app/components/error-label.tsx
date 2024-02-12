import { Flag, type FlagProps } from '@app/ui/components/flag/flag';
import { ErrorCircleIcon } from '@app/ui/icons/error-circle-icon';

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
