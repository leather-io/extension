import StacksNftBns from '@assets/images/stacks-nft-bns.png';

import { figmaTheme } from '@app/common/utils/figma-theme';

import { CollectibleItemLayout } from '../collectible-item.layout';

const backgroundProps = {
  backgroundColor: figmaTheme.surfaceSecondary,
  border: 'transparent',
  borderRadius: '16px',
};

export function StacksBnsName(props: { bnsName: string }) {
  const { bnsName } = props;

  return (
    <CollectibleItemLayout
      backgroundElementProps={backgroundProps}
      subtitle="Bitcoin Naming System"
      title={bnsName}
    >
      <img alt="nft image" src={StacksNftBns} width="100px" />
    </CollectibleItemLayout>
  );
}
