import toast from 'react-hot-toast';
import { FiCheck, FiCopy, FiExternalLink } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

import { useClipboard } from '@stacks/ui';
// FIXME migrate useClipboard hook

/**
 * interface UiClipboard {
    value: string;
    onCopy: () => void;
    hasCopied: boolean;
}
export declare function useClipboard(value: string): UiClipboard;
export {};
 * 
 * 
 * 
 * import { useState, useRef, useEffect } from 'react';

var copyToClipboard = function copyToClipboard(value) {
  var el = document.createElement("textarea");
  el.value = value;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  var curSelection = document.getSelection();
  var selected = curSelection && curSelection.rangeCount > 0 ? curSelection.getRangeAt(0) : false;
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);

  if (selected) {
    var _document$getSelectio, _document$getSelectio2;

    (_document$getSelectio = document.getSelection()) == null ? void 0 : _document$getSelectio.removeAllRanges();
    (_document$getSelectio2 = document.getSelection()) == null ? void 0 : _document$getSelectio2.addRange(selected);
  }
};

function useClipboard(value) {
  var _useState = useState(false),
      hasCopied = _useState[0],
      setHasCopied = _useState[1];

  var timers = useRef([]);

  var onCopy = function onCopy() {
    copyToClipboard(value);
    setHasCopied(true);
    timers.current.push(setTimeout(function () {
      return setHasCopied(false);
    }, 1250));
  };

  useEffect(function () {
    return function () {
      return timers.current.forEach(function (timer) {
        return clearTimeout(timer);
      });
    };
  }, []);
  return {
    value: value,
    onCopy: onCopy,
    hasCopied: hasCopied
  };
}

export { useClipboard };
//# sourceMappingURL=use-clipboard.esm.js.map

 * 
 * 
 */
import { HStack, Stack } from 'leather-styles/jsx';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useExplorerLink } from '@app/common/hooks/use-explorer-link';
import { FormAddressDisplayer } from '@app/components/address-displayer/form-address-displayer';
import {
  InfoCard,
  InfoCardAssetValue,
  InfoCardBtn,
  InfoCardFooter,
  InfoCardRow,
  InfoCardSeparator,
} from '@app/components/info-card/info-card';

export function RpcSendTransferSummary() {
  const { state } = useLocation();
  const { handleOpenTxLink } = useExplorerLink();
  const analytics = useAnalytics();

  const {
    txId,
    txValue,
    txFiatValue,
    txFiatValueSymbol,
    symbol,
    txLink,
    arrivesIn,
    sendingValue,
    recipient,
    feeRowValue,
    totalSpend,
  } = state;

  const { onCopy } = useClipboard(txId);

  // TODO: Force close window?
  // useOnMount(() => {
  //   setTimeout(() => window.close(), timeOut);
  // });

  function onClickLink() {
    void analytics.track('view_rpc_send_transfer_confirmation', { symbol: 'BTC' });
    handleOpenTxLink(txLink);
  }

  function onClickCopy() {
    onCopy();
    toast.success('ID copied!');
  }

  return (
    <>
      <InfoCard>
        <InfoCardAssetValue
          value={txValue}
          fiatValue={txFiatValue}
          fiatSymbol={txFiatValueSymbol}
          symbol={symbol}
          icon={<FiCheck />}
          mb="space.05 "
        />
        <Stack pb="space.06" width="100%">
          <InfoCardRow title="To" value={<FormAddressDisplayer address={recipient} />} />
          <InfoCardSeparator />
          <InfoCardRow title="Total spend" value={totalSpend} />
          <InfoCardRow title="Sending" value={sendingValue} />
          <InfoCardRow title="Fee" value={feeRowValue} />
          {arrivesIn && <InfoCardRow title="Estimated confirmation time" value={arrivesIn} />}
        </Stack>
        <InfoCardFooter>
          <HStack gap="space.04" width="100%">
            <InfoCardBtn icon={<FiExternalLink />} label="View Details" onClick={onClickLink} />
            <InfoCardBtn icon={<FiCopy />} label="Copy ID" onClick={onClickCopy} />
          </HStack>
        </InfoCardFooter>
      </InfoCard>
    </>
  );
}
