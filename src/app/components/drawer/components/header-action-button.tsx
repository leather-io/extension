// #4164 FIXME migrate transition
import { transition } from '@stacks/ui';
import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Box, Grid } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

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
        bg: isWaitingOnPerformedAction ? 'unset' : token('colors.brown.3'),
        cursor: isWaitingOnPerformedAction ? 'unset' : 'pointer',
      }}
      data-testid={HomePageSelectors.DrawerHeaderActionBtn}
      borderRadius="8px"
      color={token('colors.brown.12')}
      onClick={isWaitingOnPerformedAction ? undefined : onAction}
      opacity={isWaitingOnPerformedAction ? '0.3' : 'unset'}
      placeItems="center"
      position="relative"
      // #4164 FIXME  check the UI for this size / gap swap
      // size="36px"
      gap="36px"
      transition={transition}
      userSelect="none"
      zIndex={9}
    >
      <Box>{icon}</Box>
    </Grid>
  );
}
