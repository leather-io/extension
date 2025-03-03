import { Suspense } from 'react';
import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { EditNonceSheet } from '@app/features/dialogs/edit-nonce-dialog/edit-nonce-dialog';
import { ledgerBitcoinTxSigningRoutes } from '@app/features/ledger/flows/bitcoin-tx-signing/ledger-bitcoin-sign-tx-container';
import { ledgerStacksMessageSigningRoutes } from '@app/features/ledger/flows/stacks-message-signing/ledger-stacks-sign-msg.routes';
import { ledgerStacksTxSigningRoutes } from '@app/features/ledger/flows/stacks-tx-signing/ledger-sign-stacks-tx-container';
import { RpcGetAddresses } from '@app/pages/rpc-get-addresses/rpc-get-addresses';
import { rpcSendTransferRoutes } from '@app/pages/rpc-send-transfer/rpc-send-transfer.routes';
import { RpcSignPsbt } from '@app/pages/rpc-sign-psbt/rpc-sign-psbt';
import { RpcSignPsbtSummary } from '@app/pages/rpc-sign-psbt/rpc-sign-psbt-summary';
import { RpcStacksMessageSigning } from '@app/pages/rpc-sign-stacks-message/rpc-sign-stacks-message';
import { RpcStxCallContract } from '@app/pages/rpc-stx-call-contract/rpc-stx-call-contract';
import { RpcStxDeployContract } from '@app/pages/rpc-stx-deploy-contract/rpc-stx-deploy-contract';
import { RpcStxSignTransaction } from '@app/pages/rpc-stx-sign-transaction/rpc-stx-sign-transaction';
import { RpcStxTransferSip9Nft } from '@app/pages/rpc-stx-transfer-sip9-nft/rpc-stx-transfer-sip9-nft';
import { RpcStxTransferSip10Ft } from '@app/pages/rpc-stx-transfer-sip10-ft/rpc-stx-transfer-sip10-ft';
import { RpcStxTransferStx } from '@app/pages/rpc-stx-transfer-stx/rpc-stx-transfer-stx';
import { AccountGate } from '@app/routes/account-gate';

import { SuspenseLoadingSpinner } from './app-routes';

const editNonceSheetRoute = <Route path={RouteUrls.EditNonce} element={<EditNonceSheet />} />;

export const rpcRequestRoutes = (
  <>
    <Route
      path={RouteUrls.RpcGetAddresses}
      element={
        <AccountGate>
          <RpcGetAddresses />
        </AccountGate>
      }
    />

    {rpcSendTransferRoutes}

    <Route
      path={RouteUrls.RpcSignBip322Message}
      lazy={async () => {
        const { RpcSignBip322MessageRoute } = await import(
          '@app/pages/rpc-sign-bip322-message/rpc-sign-bip322-message'
        );
        return { Component: RpcSignBip322MessageRoute };
      }}
    >
      {ledgerBitcoinTxSigningRoutes}
    </Route>
    <Route
      path={RouteUrls.RpcSignPsbt}
      element={
        <AccountGate>
          <RpcSignPsbt />
        </AccountGate>
      }
    >
      {ledgerBitcoinTxSigningRoutes}
    </Route>
    <Route
      path={RouteUrls.RpcSignPsbtSummary}
      element={
        <AccountGate>
          <RpcSignPsbtSummary />
        </AccountGate>
      }
    />
    <Route
      path={RouteUrls.RpcStacksSignature}
      element={
        <AccountGate>
          <Suspense fallback={<SuspenseLoadingSpinner />}>
            <RpcStacksMessageSigning />
          </Suspense>
        </AccountGate>
      }
    >
      {ledgerStacksMessageSigningRoutes}
    </Route>

    <Route
      path={RouteUrls.RpcStxSignTransaction}
      element={
        <AccountGate>
          <RpcStxSignTransaction />
        </AccountGate>
      }
    >
      {editNonceSheetRoute}
      {ledgerStacksTxSigningRoutes}
    </Route>

    <Route
      path={RouteUrls.RpcStxCallContract}
      element={
        <AccountGate>
          <RpcStxCallContract />
        </AccountGate>
      }
    >
      {editNonceSheetRoute}
      {ledgerStacksTxSigningRoutes}
    </Route>

    <Route
      path={RouteUrls.RpcStxDeployContract}
      element={
        <AccountGate>
          <RpcStxDeployContract />
        </AccountGate>
      }
    >
      {editNonceSheetRoute}
      {ledgerStacksTxSigningRoutes}
    </Route>

    <Route
      path={RouteUrls.RpcStxTransferStx}
      element={
        <AccountGate>
          <RpcStxTransferStx />
        </AccountGate>
      }
    >
      {editNonceSheetRoute}
      {ledgerStacksTxSigningRoutes}
    </Route>

    <Route
      path={RouteUrls.RpcStxTransferSip9Nft}
      element={
        <AccountGate>
          <RpcStxTransferSip9Nft />
        </AccountGate>
      }
    >
      {editNonceSheetRoute}
      {ledgerStacksTxSigningRoutes}
    </Route>

    <Route
      path={RouteUrls.RpcStxTransferSip10Ft}
      element={
        <AccountGate>
          <RpcStxTransferSip10Ft />
        </AccountGate>
      }
    >
      {editNonceSheetRoute}
      {ledgerStacksTxSigningRoutes}
    </Route>
  </>
);
