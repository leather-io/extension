import LottieRaw, { Options } from 'react-lottie';

import { Box, BoxProps } from '@stacks/ui';

import { useThemeSwitcher } from '@app/common/theme-provider';

import * as animationDataBright from './plugged-in-cable-bright.lottie.json';

const options: Options = {
  loop: true,
  autoplay: true,
  animationData: animationDataBright,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const Lottie = LottieRaw as any;

// Required for interop with `React.lazy`
// ts-unused-exports:disable-next-line
export default function PluggingInLedgerCableAnimation(props: BoxProps) {
  const { theme } = useThemeSwitcher();
  const invertStyle = theme === 'light' ? {} : { filter: 'invert()' };

  return (
    <Box width="100%" height="200px" overflow="hidden" position="relative" {...props}>
      <Box position="absolute" left={0} right={0}>
        <Lottie options={options} width={380} style={invertStyle} />
      </Box>
    </Box>
  );
}
