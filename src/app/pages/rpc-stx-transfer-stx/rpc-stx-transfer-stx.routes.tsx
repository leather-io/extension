import { RouteUrls } from '@shared/route-urls';

import { CurrentStacksAccountLoader } from '@app/components/loaders/stacks-account-loader';
import { generateStacksRpcTransactionRequestRoutes } from '@app/features/rpc-stacks-transaction-request/stacks/stacks-rpc-transaction-request.routes';

import { RpcStxTransferStx } from './rpc-stx-transfer-stx';
import { RpcStxTransferStxContainer } from './rpc-stx-transfer-stx-container';

export const rpcStxTransferStxRoutes = generateStacksRpcTransactionRequestRoutes({
  path: RouteUrls.RpcStxTransferStx,
  container: (
    <CurrentStacksAccountLoader>
      {account => <RpcStxTransferStxContainer account={account} />}
    </CurrentStacksAccountLoader>
  ),
  element: <RpcStxTransferStx />,
});
