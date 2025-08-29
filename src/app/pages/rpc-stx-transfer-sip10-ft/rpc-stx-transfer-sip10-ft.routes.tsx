import { RouteUrls } from '@shared/route-urls';

import { CurrentStacksAccountLoader } from '@app/components/loaders/stacks-account-loader';
import { generateStacksRpcTransactionRequestRoutes } from '@app/features/rpc-stacks-transaction-request/stacks/stacks-rpc-transaction-request.routes';

import { RpcStxTransferSip10Ft } from './rpc-stx-transfer-sip10-ft';
import { RpcStxTransferSip10FtContainer } from './rpc-stx-transfer-sip10-ft-container';

export const rpcStxTransferSip10FtRoutes = generateStacksRpcTransactionRequestRoutes({
  path: RouteUrls.RpcStxTransferSip10Ft,
  container: (
    <CurrentStacksAccountLoader>
      {account => <RpcStxTransferSip10FtContainer account={account} />}
    </CurrentStacksAccountLoader>
  ),
  element: <RpcStxTransferSip10Ft />,
});
