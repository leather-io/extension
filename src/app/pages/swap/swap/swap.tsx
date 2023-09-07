import { Outlet } from 'react-router-dom';

import { Box, Flex } from '@stacks/ui';
import { useFormikContext } from 'formik';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { LeatherButton } from '@app/components/button/button';
import { ModalHeader } from '@app/components/modal-header';

import { SwapContentLayout } from '../components/swap-content.layout';
import { SwapFooterLayout } from '../components/swap-footer.layout';
import { SwapSelectedAssets } from '../components/swap-selected-assets';
import { SwapFormValues } from '../hooks/use-swap';
import { useSwapContext } from '../swap.context';
import { useMagicSwapper } from '@app/common/magic/hooks';
import { SwapMagicAuthorizeMessage } from '../components/swap-magic-authorize-message';

export function Swap() {
  const { onSubmitSwapForReview } = useSwapContext();
  const { dirty, handleSubmit, isValid, values } = useFormikContext<SwapFormValues>();
  const { isInboundMagicSwap } = useSwapType();

  const { magicSwapper, isLoading: isLoadingMagicSwapper } = useMagicSwapper({
    enabled: isInboundMagicSwap,
  });

  useRouteHeader(<ModalHeader defaultGoBack hideActions title="Swap" />, true);

  return (
    <Box width="100%">
      <SwapContentLayout>
        <SwapSelectedAssets />
        {(isInboundMagicSwap && !isLoadingMagicSwapper && !magicSwapper?.isAuthorized) && (
          <Flex marginTop={5}>
            <SwapMagicAuthorizeMessage />
          </Flex>
        )}
      </SwapContentLayout>
      <SwapFooterLayout>
        <LeatherButton
          disabled={!(dirty && isValid && (isInboundMagicSwap && magicSwapper?.isAuthorized))}
          onClick={async (e: any) => {
            handleSubmit(e);
            await onSubmitSwapForReview(values);
          }}
          width="100%"
        >
          Review and swap
        </LeatherButton>
      </SwapFooterLayout>
      <Outlet />
    </Box>
  );
}

type Swap =
  | { type: 'magic', direction: 'inbound' | 'outbound' }
  | { type: 'unsupported' };

function useSwapType() {
  const { values } = useFormikContext<SwapFormValues>();

  let swap: Swap;

  const fromAssetSymbol = values.swapAssetFrom?.balance.symbol;
  const toAssetSymbol = values.swapAssetTo?.balance.symbol;

  if (fromAssetSymbol === 'BTC' && toAssetSymbol === 'xBTC') {
    swap = {
      type: 'magic',
      direction: 'inbound',
    };
  } else if (fromAssetSymbol === 'xBTC' && toAssetSymbol === 'BTC') {
    swap = {
      type: 'magic',
      direction: 'outbound',
    };
  } else {
    swap =  {
      type: 'unsupported',
    }
  }

  return {
    swap,
    isInboundMagicSwap: swap.type === 'magic' && swap.direction === 'inbound',
  }
}
