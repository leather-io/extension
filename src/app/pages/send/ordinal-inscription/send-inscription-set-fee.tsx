import { useNavigate } from 'react-router-dom';

// import get from 'lodash.get';
// import { RouteUrls } from '@shared/route-urls';
import { BaseDrawer } from '@app/components/drawer/base-drawer';

// import { BitcoinSetFee } from '../send-crypto-asset-form/family/bitcoin/components/bitcoin-set-fee';
// import { useInscriptionSendState } from './send-inscription-container';

// function useSendInscriptionSetFeeState() {
//   const location = useLocation();
//   return {
//     tx: get(location.state, 'tx') as string,
//     recipient: get(location.state, 'recipient', '') as string,
//   };
// }

export function SendInscriptionSetFee() {
  const navigate = useNavigate();
  // const { tx, recipient } = useSendInscriptionSetFeeState();
  // const { inscription, utxo } = useInscriptionSendState();

  // function previewTransaction(feeRate: number, feeValue: number, time: string) {
  //   feeRate;
  //   navigate(RouteUrls.SendOrdinalInscriptionReview, {
  //     state: { fee: feeValue, inscription, utxo, recipient, tx, arrivesIn: time },
  //   });
  // }

  return (
    <BaseDrawer title="Choose fee" isShowing enableGoBack onClose={() => navigate(-1)}>
      {/* <BitcoinSetFee onChooseFee={previewTransaction} recipient={recipient} amount={}/>; */}
    </BaseDrawer>
  );
}
