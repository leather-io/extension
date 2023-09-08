import { Suspense, useState } from 'react';

// TODO assess + refactor SlideFade + Fade
//  try replace it with easing if we even really need it
// https://panda-css.com/docs/theming/tokens#easings

/**
 *
var getTransitionStyles = function getTransitionStyles(initialScale) {
  return {
    init: {
      opacity: 0,
      transform: "scale(" + initialScale + ")"
    },
    entered: {
      opacity: 1,
      transform: "scale(1)"
    },
    exiting: {
      opacity: 0,
      transform: "scale(" + initialScale + ")"
    }
  };
};

var ScaleFade = function ScaleFade(_ref) {
  var _ref$initialScale = _ref.initialScale,
      initialScale = _ref$initialScale === void 0 ? 0.9 : _ref$initialScale,
      _ref$timeout = _ref.timeout,
      timeout = _ref$timeout === void 0 ? 300 : _ref$timeout,
      rest = _objectWithoutPropertiesLoose(_ref, ["initialScale", "timeout"]);

  return createElement(Transition, _extends({
    styles: useMemo(function () {
      return getTransitionStyles(initialScale);
    }, [initialScale]),
    transition: "all " + timeout + "ms cubic-bezier(0.45, 0, 0.40, 1)",
    timeout: {
      enter: 50,
      exit: timeout
    },
    unmountOnExit: true
  }, rest));
};

export { ScaleFade };
 *
 *
 */
// #4164 FIXME migrate SlideFade
import { SlideFade } from '@stacks/ui';
import { Box, Flex, Stack, StackProps } from 'leather-styles/jsx';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { Tabs } from '@app/components/tabs';

const analyticsPath = ['/recommended', '/custom'];

interface ChooseFeeTabsProps extends StackProps {
  customFee: React.JSX.Element;
  feesList: React.JSX.Element;
}
export function ChooseFeeTabs(props: ChooseFeeTabsProps) {
  const { feesList, customFee, ...rest } = props;
  const analytics = useAnalytics();
  // TODO #4013: Refactor this to use routes for tabs like home-tabs
  const [activeTab, setActiveTab] = useState(0);

  const setActiveTabTracked = (index: number) => {
    void analytics.page('view', analyticsPath[index]);
    setActiveTab(index);
  };

  return (
    <Stack flexGrow={1} mt="space.02" gap="space.04" width="100%" {...rest}>
      <Tabs
        tabs={[
          { slug: 'recommended', label: 'Recommended' },
          { slug: 'custom', label: 'Custom' },
        ]}
        activeTab={activeTab}
        onTabClick={setActiveTabTracked}
      />
      <Flex position="relative" flexGrow={1}>
        {activeTab === 0 && (
          <Suspense fallback={<LoadingSpinner pb="72px" />}>
            <SlideFade in={true}>
              {(styles: React.CSSProperties) => (
                <Box style={styles} width="100%">
                  {feesList}
                </Box>
              )}
            </SlideFade>
          </Suspense>
        )}
        {activeTab === 1 && (
          <Suspense fallback={<LoadingSpinner pb="72px" />}>
            <SlideFade in={true}>
              {(styles: React.CSSProperties) => (
                <Box width="100%" style={styles}>
                  {customFee}
                </Box>
              )}
            </SlideFade>
          </Suspense>
        )}
      </Flex>
    </Stack>
  );
}
