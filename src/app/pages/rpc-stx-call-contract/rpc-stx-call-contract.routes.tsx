import { RouteUrls } from '@shared/route-urls';

import { CurrentStacksAccountLoader } from '@app/components/loaders/stacks-account-loader';
import { generateStacksRpcTransactionRequestRoutes } from '@app/features/rpc-transaction-request/stacks/stacks-rpc-transaction-request.routes';

import { RpcStxCallContract } from './rpc-stx-call-contract';
import { RpcStxCallContractContainer } from './rpc-stx-call-contract-container';

export const rpcStxCallContractRoutes = generateStacksRpcTransactionRequestRoutes({
  path: RouteUrls.RpcStxCallContract,
  container: (
    <CurrentStacksAccountLoader>
      {account => <RpcStxCallContractContainer account={account} />}
    </CurrentStacksAccountLoader>
  ),
  element: <RpcStxCallContract />,
});
