import { RouteUrls } from '@shared/route-urls';

import { CurrentStacksAccountLoader } from '@app/components/loaders/stacks-account-loader';
import { generateStacksRpcTransactionRequestRoutes } from '@app/features/rpc-transaction-request/stacks/stacks-rpc-transaction-request.routes';

import { RpcStxSignTransaction } from './rpc-stx-sign-transaction';
import { RpcStxSignTransactionContainer } from './rpc-stx-sign-transaction-container';

export const rpcStxSignTransactionRoutes = generateStacksRpcTransactionRequestRoutes({
  path: RouteUrls.RpcStxSignTransaction,
  container: (
    <CurrentStacksAccountLoader>
      {account => <RpcStxSignTransactionContainer account={account} />}
    </CurrentStacksAccountLoader>
  ),
  element: <RpcStxSignTransaction />,
});
