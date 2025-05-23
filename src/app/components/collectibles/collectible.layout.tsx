import { Box, Flex, Grid, HStack, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import {
  ArrowOutOfBoxIcon,
  ArrowRotateRightLeftIcon,
  DropdownMenu,
  Flag,
  Spinner,
  TrashIcon,
} from '@leather.io/ui';

interface CollectiblesLayoutProps {
  title: string;
  isLoading: boolean;
  isLoadingMore?: boolean;
  onRefresh(): void;
  onDiscardAllInscriptions(): void;
  onRecoverAllInscriptions(): void;
  subHeader?: React.ReactNode;
  children: React.ReactNode;
}
export function CollectiblesLayout({
  title,
  isLoading,
  onRefresh,
  subHeader,
  children,
  onDiscardAllInscriptions,
  onRecoverAllInscriptions,
}: CollectiblesLayoutProps) {
  return (
    <>
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center" flex={1}>
        <HStack columnGap="space.02">
          <styled.span textStyle="label.01" paddingY="space.05">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>{title}</DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <Box p="space.02" textStyle="label.03">
                  <DropdownMenu.Item onClick={() => onRecoverAllInscriptions()}>
                    <Flag spacing="space.02" img={<ArrowOutOfBoxIcon variant="small" />}>
                      Recover all inscriptions
                    </Flag>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => onDiscardAllInscriptions()}>
                    <Flag
                      spacing="space.02"
                      color="red.action-primary-default"
                      img={<TrashIcon color="red.action-primary-default" variant="small" />}
                    >
                      Unprotect all inscriptions
                    </Flag>
                  </DropdownMenu.Item>
                </Box>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </styled.span>
          {isLoading ? (
            <Spinner color={token('colors.ink.text-primary')} opacity={0.5} />
          ) : (
            <ArrowRotateRightLeftIcon
              cursor="pointer"
              onClick={() => onRefresh()}
              variant="small"
            />
          )}
        </HStack>
        {subHeader}
      </Flex>
      <Grid
        gridTemplateColumns={{
          base: 'repeat(auto-fill, minmax(156px, 1fr))',
          md: 'repeat(auto-fill, minmax(184px, 1fr))',
        }}
      >
        {children}
      </Grid>
    </>
  );
}
