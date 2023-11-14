import { Box, Stack, styled } from 'leather-styles/jsx';

import { Prism } from '@app/common/clarity-prism';
import { HasChildren } from '@app/common/has-children';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';
import { ErrorBoundary, FallbackProps, useErrorHandler } from '@app/features/errors/error-boundary';
import { openGithubIssue } from '@app/features/errors/utils';
import { useErrorStackTraceState } from '@app/store/ui/ui.hooks';
import { CodeBlock } from '@app/ui/components/codeblock';
import { Title } from '@app/ui/components/typography/title';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const [value] = useErrorStackTraceState();

  useRouteHeader(<Header />);

  return (
    <Stack gap="space.06" flexGrow={1}>
      <Title>Something went wrong</Title>
      <Box className="error-codeblock" maxWidth="100vw" overflow="hidden">
        {value && (
          <CodeBlock
            border="default"
            code={value}
            flexShrink={1}
            overflow="auto"
            language="bash"
            maxHeight="305px"
            maxWidth="100%"
            prism={Prism as any}
            width="100%"
          />
        )}
      </Box>
      <Stack mt="auto" gap="space.04">
        <styled.button onClick={resetErrorBoundary} type="button">
          Reload extension
        </styled.button>
        <styled.button
          onClick={() => openGithubIssue({ message: error.message, stackTrace: value })}
          type="button"
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
