import { Box, Stack, styled } from 'leather-styles/jsx';

// TODO #3986 improve this page
// TODO #4476 check if we need Prism - likely not
// import { Prism } from '@app/common/clarity-prism';
import { HasChildren } from '@app/common/has-children';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';
import { ErrorBoundary, FallbackProps, useErrorHandler } from '@app/features/errors/error-boundary';
import { openGithubIssue } from '@app/features/errors/utils';
import { useErrorStackTraceState } from '@app/store/ui/ui.hooks';
import { Title } from '@app/ui/components/typography/title';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const [value] = useErrorStackTraceState();

  useRouteHeader(<Header />);

  return (
    <Stack gap="space.06" flexGrow={1}>
      <Title>Something went wrong</Title>
      <Box className="error-codeblock" maxWidth="100vw" overflow="hidden">
        {value && (
          <styled.pre
            maxWidth="100%"
            flexShrink={1}
            overflow="auto"
            maxHeight="305px"
            border="4px solid"
            borderColor="accent.border-default"
            borderRadius="12px"
            backgroundColor="ink.1000"
            width="100%"
            // Prism={Prism as any}
          >
            {value}
          </styled.pre>
        )}
      </Box>
      <Stack mt="auto" gap="space.04">
        <styled.button onClick={resetErrorBoundary}>Reload extension</styled.button>
        <styled.button
          onClick={() => openGithubIssue({ message: error.message, stackTrace: value })}
        >
          Report issue on GitHub
        </styled.button>
      </Stack>
    </Stack>
  );
}

export function AppErrorBoundary({ children }: HasChildren) {
  const handleOnError = useErrorHandler();
  return (
    <ErrorBoundary
      onReset={() => window.location.reload()}
      FallbackComponent={ErrorFallback}
      onError={handleOnError}
    >
      {children}
    </ErrorBoundary>
  );
}
