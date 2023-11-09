import { Stack } from 'leather-styles/jsx';

import { LoadingSpinner } from '@app/components/loading-spinner';

interface SendInscriptionFormLoaderProps {
  children: React.JSX.Element;
  isLoading: boolean;
}

export function SendInscriptionFormLoader({ children, isLoading }: SendInscriptionFormLoaderProps) {
  if (isLoading) {
    return (
      <Stack py="108px">
        <LoadingSpinner />
      </Stack>
    );
  }
  return children;
}
