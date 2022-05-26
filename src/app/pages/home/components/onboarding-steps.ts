import AddFundsFull from '@assets/images/onboarding/steps/add-funds-light.png';
import AddFundsFullDone from '@assets/images/onboarding/steps/add-funds-light-done.png';
import AddFundsPopup from '@assets/images/onboarding/steps/add-funds-light-sm.png';
import AddFundsPopupDone from '@assets/images/onboarding/steps/add-funds-light-done-sm.png';

import BackUpSecretKeyFull from '@assets/images/onboarding/steps/backup-key-light.png';
import BackUpSecretKeyFullDone from '@assets/images/onboarding/steps/backup-key-light-done.png';
import BackUpSecretKeyPopup from '@assets/images/onboarding/steps/backup-key-light-sm.png';
import BackUpSecretKeyPopupDone from '@assets/images/onboarding/steps/backup-key-light-done-sm.png';

import BuyNftFull from '@assets/images/onboarding/steps/buy-nft-light.png';
import BuyNftFullDone from '@assets/images/onboarding/steps/buy-nft-light-done.png';
import BuyNftPopup from '@assets/images/onboarding/steps/buy-nft-light-sm.png';
import BuyNftPopupDone from '@assets/images/onboarding/steps/buy-nft-light-done-sm.png';

import ExploreAppsFull from '@assets/images/onboarding/steps/explore-apps-light.png';
import ExploreAppsFullDone from '@assets/images/onboarding/steps/explore-apps-light-done.png';
import ExploreAppsPopup from '@assets/images/onboarding/steps/explore-apps-light-sm.png';
import ExploreAppsPopupDone from '@assets/images/onboarding/steps/explore-apps-light-done-sm.png';

import { OnboardingSteps, RouteType } from '@shared/models/onboarding-types';
import { RouteUrls } from '@shared/route-urls';

export const onboardingSteps = [
  {
    action: 'View secret key',
    body: "Don't lose access to your account and crypto",
    event: 'back_up_secret_key',
    imageFull: BackUpSecretKeyFull,
    imageFullDone: BackUpSecretKeyFullDone,
    imagePopup: BackUpSecretKeyPopup,
    imagePopupDone: BackUpSecretKeyPopupDone,
    route: RouteUrls.ViewSecretKey,
    routeType: RouteType.Internal,
    title: OnboardingSteps.BackUpSecretKey,
  },
  {
    action: 'Get STX',
    body: 'Get some STX so you can start using apps',
    event: 'add_funds',
    imageFull: AddFundsFull,
    imageFullDone: AddFundsFullDone,
    imagePopup: AddFundsPopup,
    imagePopupDone: AddFundsPopupDone,
    route: RouteUrls.Buy,
    routeType: RouteType.Internal,
    title: OnboardingSteps.AddFunds,
  },
  {
    action: 'Find apps',
    body: 'Try Stacks apps for finance, NFTs, blogging and more',
    event: 'explore_apps',
    imageFull: ExploreAppsFull,
    imageFullDone: ExploreAppsFullDone,
    imagePopup: ExploreAppsPopup,
    imagePopupDone: ExploreAppsPopupDone,
    route: 'https://www.stacks.co/explore/discover-apps#apps',
    routeType: RouteType.External,
    title: OnboardingSteps.ExploreApps,
  },
  {
    action: 'Find NFT',
    body: 'Collect and trade NFTs secured by Bitcoin',
    event: 'buy_nft',
    imageFull: BuyNftFull,
    imageFullDone: BuyNftFullDone,
    imagePopup: BuyNftPopup,
    imagePopupDone: BuyNftPopupDone,
    route: 'https://www.hiro.so/wallet-faq/nfts',
    routeType: RouteType.External,
    title: OnboardingSteps.BuyNft,
  },
];
