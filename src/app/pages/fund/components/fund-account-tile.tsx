import { FundPageSelectors } from '@tests/selectors/fund.selectors';
import { Box, HStack, Stack, styled } from 'leather-styles/jsx';

interface FundAccountTileProps {
  attributes?: React.JSX.Element;
  description: string;
  icon: string;
  onClickTile(): void;
  ReceiveIcon?(): React.JSX.Element;
  testId: string;
  title?: string;
}
export function FundAccountTile(props: FundAccountTileProps) {
  const { attributes, description, icon, onClickTile, ReceiveIcon, testId, title } = props;

  return (
    <styled.button
      _focus={{
        border: 'focus',
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.08)',
        margin: '-2px',
      }}
      _hover={{
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.08)',
        cursor: 'pointer',
      }}
      border="default"
      borderRadius="sm"
      boxShadow="0px 1px 2px rgba(0, 0, 0, 0.04)"
      data-testid={testId}
      display="flex"
      height="11.3rem"
      textAlign="left"
      transition="transition"
      onClick={onClickTile}
      type="button"
      width={['100%', '17.5rem']}
    >
      <Stack alignItems="flex-start" gap="space.03" p="space.05">
        <HStack alignItems="center" gap={ReceiveIcon ? 'space.02' : 'space.04'}>
          {ReceiveIcon ? <ReceiveIcon /> : null}
          <Box
            alignItems="center"
            bg="white"
            border="default"
            borderRadius="xs"
            display="inline-flex"
            height="40px"
            justifyContent="center"
            width="40px"
          >
            <img src={icon} width="24px" />
          </Box>

          <styled.span
            textStyle="label.02"
            data-testid={FundPageSelectors.FiatProviderName}
            color="ink.text-primary"
          >
            {title}
          </styled.span>
        </HStack>
        <styled.span
          data-testid={FundPageSelectors.FiatProviderName}
          color="ink.text-subdued"
          minHeight="50px"
          textStyle="body.02"
        >
          {description}
        </styled.span>
        <HStack gap="space.02">{attributes}</HStack>
      </Stack>
    </styled.button>
  );
}
