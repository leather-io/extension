import { Outlet, useLocation } from 'react-router-dom';

interface LedgerContainerProps {}
export function LedgerContainer(props: LedgerContainerProps) {
  console.log('ledger container');
  const location = useLocation();

  return <Outlet />;
}
