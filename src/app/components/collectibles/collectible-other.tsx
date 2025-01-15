import { Box } from 'leather-styles/jsx';

import { CollectibleItemLayout, CollectibleItemLayoutProps } from './collectible-item.layout';

interface CollectibleOtherProps extends Omit<CollectibleItemLayoutProps, 'children'> {
  children: React.JSX.Element;
}
export function CollectibleOther({ children, ...props }: CollectibleOtherProps) {
  return (
    <CollectibleItemLayout {...props}>
      <Box
        alignItems="center"
        bg="black"
        display="flex"
        height="100%"
        justifyContent="center"
        width="100%"
      >
        {children}
      </Box>
    </CollectibleItemLayout>
  );
}
