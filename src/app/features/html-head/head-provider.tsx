import { Link, HeadProvider as ReastHeadProvider, Title } from 'react-head';

export function HeadProvider() {
  return (
    <ReastHeadProvider>
      <LeatherMetaTags />
    </ReastHeadProvider>
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
