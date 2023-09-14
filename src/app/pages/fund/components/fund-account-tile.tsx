import { Box, Stack, color, transition } from '@stacks/ui';
import { FundPageSelectors } from '@tests/selectors/fund.selectors';
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
    <Box
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
      as="button"
      border="1px solid"
      borderColor={color('border')}
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
      <Stack
        alignItems="flex-start"
        p={token('spacing.space.05')}
        spacing={token('spacing.space.05')}
      >
        <Stack alignItems="center" isInline spacing={receiveStxIcon ? 'tight' : 'base'}>
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
        </Stack>
        <styled.span
          textStyle="body.02"
          data-testid={FundPageSelectors.FiatProviderName}
          color="accent.text-subdued"
          mb="0.75rem"
        >
          {description}
        </styled.span>
        <Stack isInline spacing="tight">
          {attributes}
        </Stack>
      </Stack>
    </Box>
  );
}
