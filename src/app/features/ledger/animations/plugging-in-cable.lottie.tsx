import LottieRaw, { Options } from 'react-lottie';

import { Box, BoxProps } from 'leather-styles/jsx';

import * as animationData from './plugging-in-cable.lottie.json';

const options: Options = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const Lottie = LottieRaw as any;

// Required for interop with `React.lazy`
// ts-unused-exports:disable-next-line
export default function PluggingInLedgerCableAnimation(props: BoxProps) {
  return (
    <Box width="100%" height="200px" overflow="hidden" position="relative" {...props}>
      <Box position="absolute" left="-72px" right={0}>
        <Lottie options={options} width={600} />
      </Box>
    </Box>
  );
}
