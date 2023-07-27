import * as btc from '@scure/btc-signer';

import { GlobalAppEvents, appEvents } from '@app/common/publish-subscribe';

export async function listenForBitcoinTxLedgerSigning(psbt: string): Promise<btc.Transaction> {
  return new Promise((resolve, reject) => {
    function txSignedHandler(msg: GlobalAppEvents['ledgerBitcoinTxSigned']) {
      if (msg.unsignedPsbt === psbt) {
        appEvents.unsubscribe('ledgerBitcoinTxSigned', txSignedHandler);
        appEvents.unsubscribe('ledgerBitcoinTxSigningCancelled', signingAbortedHandler);
        resolve(msg.signedPsbt);
      }
    }
    appEvents.subscribe('ledgerBitcoinTxSigned', txSignedHandler);

    function signingAbortedHandler(msg: GlobalAppEvents['ledgerBitcoinTxSigningCancelled']) {
      if (msg.unsignedPsbt === psbt) {
        appEvents.unsubscribe('ledgerBitcoinTxSigningCancelled', signingAbortedHandler);
        appEvents.unsubscribe('ledgerBitcoinTxSigned', txSignedHandler);
        reject(new Error('User cancelled the signing operation'));
      }
    }
    appEvents.subscribe('ledgerBitcoinTxSigningCancelled', signingAbortedHandler);
  });
}
