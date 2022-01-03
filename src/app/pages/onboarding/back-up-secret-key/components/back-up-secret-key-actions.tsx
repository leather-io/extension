import { FiEyeOff, FiLock, FiRotateCcw } from 'react-icons/fi';
import { Box, Button, color, Stack } from '@stacks/ui';

import { Caption } from '@app/components/typography';
import { Link } from '@app/components/link';
import { isFullPage } from '@app/common/utils';

interface BackUpSecretKeyLayoutProps {
  onBackedUpSecretKey(): void;
}
export function BackUpSecretKeyActions(props: BackUpSecretKeyLayoutProps): JSX.Element {
  const { onBackedUpSecretKey } = props;

  return (
    <>
      <Stack alignItems="center" isInline>
        <Box as={FiRotateCcw} color={color('text-caption')} size="12px" />
        <Caption>Your Secret Key gives access to your account</Caption>
      </Stack>
      <Stack alignItems="center" isInline>
        <Box as={FiEyeOff} color={color('text-caption')} size="12px" />
        <Caption>Never share your Secret Key</Caption>
      </Stack>
      <Stack alignItems="center" isInline>
        <Box as={FiLock} color={color('text-caption')} size="12px" />
        <Caption>Put it somewhere private and secure</Caption>
      </Stack>
      <Stack alignItems={isFullPage ? 'center' : 'start'} isInline={isFullPage} spacing="loose">
        <Button
          borderRadius="10px"
          height="48px"
          mr="24px !important"
          onClick={onBackedUpSecretKey}
          width="198px"
        >
          I've backed it up
        </Button>
        <Stack isInline alignItems="center">
          <Caption mr="4px !important">Or</Caption>
          <Link fontSize="14px" onClick={() => {}}>
            back it up later
          </Link>
        </Stack>
      </Stack>
    </>
  );
}
