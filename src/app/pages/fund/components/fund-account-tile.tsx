import { FundPageSelectors } from '@tests/selectors/fund.selectors';
import { Box, Stack } from 'leather-styles/jsx';
import { styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

interface FundAccountTileProps {
  attributes?: React.JSX.Element;
  description: string;
  icon: string;
  onClickTile(): void;
  receiveStxIcon?: React.JSX.Element;
  testId: string;
  title?: string;
}
export function FundAccountTile(props: FundAccountTileProps) {
  const { attributes, description, icon, onClickTile, receiveStxIcon, testId, title } = props;

  return (
    <styled.button
      _focus={{
        border: '3px solid',
        borderColor: '#5546FF',
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.08)',
        margin: '-2px',
      }}
      _hover={{
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.08)',
        cursor: 'pointer',
      }}
      border="1px solid"
      borderColor={token('colors.accent.background-primary')}
      backgroundColor={token('colors.accent.background-primary')}
      borderRadius="16px"
      boxShadow="0px 1px 2px rgba(0, 0, 0, 0.04)"
      transition={transition}
      data-testid={testId}
      display="flex"
      onClick={onClickTile}
      textAlign="left"
      width="17.5rem"
      height="11.3rem"
    >
      <Stack alignItems="flex-start" p={token('spacing.space.05')} gap={token('spacing.space.05')}>
        <HStack alignItems="center" gap={receiveStxIcon ? 'space.02' : 'space.04'}>
          {receiveStxIcon}
          <Box
            alignItems="center"
            border="1px solid"
            borderColor="#DCDDE2"
            borderRadius="10px"
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
            color="accent.text-primary"
          >
            {title}
          </styled.span>
        </HStack>
        <styled.span
          textStyle="body.02"
          data-testid={FundPageSelectors.FiatProviderName}
          color="accent.text-subdued"
          mb="0.75rem"
        >
          {description}
        </styled.span>
        <HStack gap="space.02">{attributes}</HStack>
      </Stack>
    </styled.button>
  );
}
