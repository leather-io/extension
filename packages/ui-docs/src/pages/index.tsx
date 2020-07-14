import React from 'react';
import Head from 'next/head';
import { useAppState } from '@common/hooks/use-app-state';
import { fetchLatestPackageVersion } from '@common/lib';
import { HomeLayout } from '@components/layouts/home';
import { Hero } from '@components/home/sections/hero';
import dynamic from 'next/dynamic';
import { PatternsSection } from '@components/home/sections/patterns';
import { CTASection } from '@components/home/sections/cta';
import { Footer } from '@components/home/footer';

const CodeSection = dynamic(() => import('../components/home/sections/code'));

const Homepage = ({ version }: { version: string }) => {
  const { version: _version, doSetVersion } = useAppState();
  React.useEffect(() => {
    if (version && _version !== version) {
      doSetVersion(version);
    }
  }, [_version, version]);
  return (
    <>
      <Head>
        <title>Blockstack UI</title>
      </Head>
      <HomeLayout>
        <Hero />
        <CodeSection />
        <PatternsSection />
        <CTASection />
        <Footer />
      </HomeLayout>
    </>
  );
};

export async function getStaticProps() {
  return {
    props: await fetchLatestPackageVersion(),
    // we will attempt to re-generate the page:
    // - when a request comes in
    // - at most once every second
    revalidate: 1,
  };
}

export default Homepage;
