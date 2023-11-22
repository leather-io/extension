import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Grid } from 'leather-styles/jsx';

interface HeaderActionButtonProps {
  icon?: React.JSX.Element;
  isWaitingOnPerformedAction?: boolean;
  onAction?(): void;
}
export function HeaderActionButton(props: HeaderActionButtonProps) {
  const { icon, isWaitingOnPerformedAction, onAction } = props;

  return (
    <Grid
      _hover={{
        bg: isWaitingOnPerformedAction ? 'unset' : 'accent.component-background-hover',
        cursor: isWaitingOnPerformedAction ? 'unset' : 'pointer',
      }}
      data-testid={HomePageSelectors.DrawerHeaderActionBtn}
      borderRadius="xs"
      color="accent.action-primary-default"
      height="36px"
      onClick={isWaitingOnPerformedAction ? undefined : onAction}
      opacity={isWaitingOnPerformedAction ? '0.3' : 'unset'}
      placeItems="center"
      position="relative"
      transition="transition"
      userSelect="none"
      width="36px"
      zIndex={999}
    >
      {icon}
    </Grid>
  );
}
