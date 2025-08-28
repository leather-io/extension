import { RouteUrls } from '@shared/route-urls';

import { CurrentStacksAccountLoader } from '@app/components/loaders/stacks-account-loader';
import { generateStacksRpcTransactionRequestRoutes } from '@app/features/rpc-stacks-transaction-request/stacks/stacks-rpc-transaction-request.routes';

import { RpcStxDeployContract } from './rpc-stx-deploy-contract';
import { RpcStxDeployContractContainer } from './rpc-stx-deploy-contract-container';

export const rpcStxDeployContractRoutes = generateStacksRpcTransactionRequestRoutes({
  path: RouteUrls.RpcStxDeployContract,
  container: (
    <CurrentStacksAccountLoader>
      {account => <RpcStxDeployContractContainer account={account} />}
    </CurrentStacksAccountLoader>
  ),
  element: <RpcStxDeployContract />,
});
