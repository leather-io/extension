import { Outlet } from 'react-router-dom';

import { SendInscriptionLoader } from './send-inscription-loader';

export function SendInscriptionContainer() {
  return (
    <SendInscriptionLoader>
      {({ feeRates, inscription, utxo }) => <Outlet context={{ feeRates, inscription, utxo }} />}
    </SendInscriptionLoader>
  );
}
