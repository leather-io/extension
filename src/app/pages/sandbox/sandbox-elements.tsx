import { Link } from 'react-router-dom';

import { Stack, styled } from 'leather-styles/jsx';

import { SandboxButtons } from './sandbox-buttons';
import { SandboxTypography } from './sandbox-typography';

const sandboxRoutes = [
  {
    path: '/sandbox/buttons',
    element: <SandboxButtons />,
    title: 'Buttons',
  },
  {
    path: '/sandbox/typography',
    element: <SandboxTypography />,
    title: 'Typography',
  },
];

export function SandboxElements() {
  return (
    <Stack display="flex" width="100%">
      {sandboxRoutes.map(route => (
        <Link key={route.path} to={route.path}>
          <styled.span textDecoration="underline">{route.title}</styled.span>
        </Link>
      ))}
    </Stack>
  );
}
