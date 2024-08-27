import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { ledgerBitcoinTxSigningRoutes } from '@app/features/ledger/flows/bitcoin-tx-signing/ledger-bitcoin-sign-tx-container';
import { BroadcastError } from '@app/pages/send/broadcast-error/broadcast-error';
import { SendInscriptionContainer } from '@app/pages/send/ordinal-inscription/components/send-inscription-container';
import { SendInscriptionChooseFee } from '@app/pages/send/ordinal-inscription/send-inscription-choose-fee';
import { SendInscriptionForm } from '@app/pages/send/ordinal-inscription/send-inscription-form';
import { SendInscriptionReview } from '@app/pages/send/ordinal-inscription/send-inscription-review';
import { SendInscriptionSummary } from '@app/pages/send/ordinal-inscription/sent-inscription-summary';

export const sendOrdinalRoutes = (
  <Route path={RouteUrls.SendOrdinalInscription} element={<SendInscriptionContainer />}>
    {ledgerBitcoinTxSigningRoutes}

    <Route index element={<SendInscriptionForm />} />
    <Route path={RouteUrls.SendOrdinalInscriptionChooseFee} element={<SendInscriptionChooseFee />}>
      {ledgerBitcoinTxSigningRoutes}
    </Route>
    <Route path={RouteUrls.SendOrdinalInscriptionReview} element={<SendInscriptionReview />} />

    <Route path={RouteUrls.SendOrdinalInscriptionSent} element={<SendInscriptionSummary />} />
    <Route path={RouteUrls.SendOrdinalInscriptionError} element={<BroadcastError showInSheet />} />
  </Route>
);
