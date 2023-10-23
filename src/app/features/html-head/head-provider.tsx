import { Link, HeadProvider as ReastHeadProvider, Title } from 'react-head';

import { useNewBrandApprover } from '@app/store/settings/settings.selectors';

export function HeadProvider() {
  const { hasApprovedNewBrand } = useNewBrandApprover();
  return (
    <ReastHeadProvider>
      {hasApprovedNewBrand ? <LeatherMetaTags /> : <HiroMetaTags />}
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

function HiroMetaTags() {
  return (
    <>
      <Title>Hiro Wallet</Title>
      <Link rel="icon" href="/assets/icons/leather-icon-128.png" />
    </>
  );
}
