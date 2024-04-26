import LottieRaw, { Options } from 'react-lottie';

import { Box, BoxProps } from 'leather-styles/jsx';

import { useThemeSwitcher } from '@app/common/theme-provider';

import * as animationDataBright from './plugged-in-cable-bright.lottie.json';

const Lottie = LottieRaw as any;

const options: Options = {
  loop: true,
  autoplay: true,
  animationData: animationDataBright,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

// Required for interop with `React.lazy`
// ts-unused-exports:disable-next-line
export default function PluggingInLedgerCableAnimation(props: BoxProps) {
  const { theme } = useThemeSwitcher();
  const invertStyle = theme === 'light' ? {} : { filter: 'invert()' };

  return (
    <Box height="200px" overflow="hidden" position="relative" width="100%" {...props}>
      <Box position="absolute" left={0} right={0} style={invertStyle}>
        <Lottie options={options} width={380} />
      </Box>
    </Box>
  );
}
