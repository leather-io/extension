import { Link, HeadProvider as ReactHeadProvider, Title } from 'react-head';

export function HeadProvider() {
  return (
    <ReactHeadProvider>
      <LeatherMetaTags />
    </ReactHeadProvider>
  );
}

function LeatherMetaTags() {
  const suffix = process.env.WALLET_ENVIRONMENT === 'development' ? '-dev' : '';
  return (
    <>
      <Title>Leather</Title>
      <Link rel="icon" href={`/assets/icons/leather-icon-128${suffix}.png`} />
    </>
  );
}
