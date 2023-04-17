import { useNavigate } from 'react-router-dom';

// import get from 'lodash.get';
// import { RouteUrls } from '@shared/route-urls';
import { BaseDrawer } from '@app/components/drawer/base-drawer';

// import { BitcoinChooseFee } from '../send-crypto-asset-form/family/bitcoin/components/bitcoin-choose-fee';
// import { useInscriptionSendState } from './send-inscription-container';

// function useSendInscriptionChooseFeeState() {
//   const location = useLocation();
//   return {
//     tx: get(location.state, 'tx') as string,
//     recipient: get(location.state, 'recipient', '') as string,
//   };
// }

export function SendInscriptionChooseFee() {
  const navigate = useNavigate();
  // const { tx, recipient } = useSendInscriptionChooseFeeState();
  // const { inscription, utxo } = useInscriptionSendState();

  // function previewTransaction(feeRate: number, feeValue: number, time: string) {
  //   feeRate;
  //   navigate(RouteUrls.SendOrdinalInscriptionReview, {
  //     state: { fee: feeValue, inscription, utxo, recipient, tx, arrivesIn: time },
  //   });
  // }

  return (
    <BaseDrawer title="Choose fee" isShowing enableGoBack onClose={() => navigate(-1)}>
      {/* <BitcoinChooseFee onChooseFee={previewTransaction} recipient={recipient} amount={}/>; */}
    </BaseDrawer>
  );
}
