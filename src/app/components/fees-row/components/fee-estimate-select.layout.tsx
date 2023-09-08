import { ReactNode, useRef } from 'react';
import { FiInfo } from 'react-icons/fi';

// TODO assess + refactor stacks/ui FADE
// Can probably just replace with Panda Easings https://panda-css.com/docs/theming/tokens#easings

/**
 * // fade.esm.js
 * var styles = {
  init: {
    opacity: 0
  },
  entered: {
    opacity: 1
  },
  exiting: {
    opacity: 0
  }
};
var Fade = function Fade(_ref) {
  var _ref$timeout = _ref.timeout,
      timeout = _ref$timeout === void 0 ? 250 : _ref$timeout,
      rest = _objectWithoutPropertiesLoose(_ref, ["timeout"]);

  return createElement(Transition, _extends({
    transition: "all " + timeout + "ms cubic-bezier(0.175, 0.885, 0.320, 1.175)",
    styles: styles,
    timeout: {
      enter: 50,
      exit: timeout
    }
  }, rest));
};

export { Fade };
 */
// #4164 FIXME replace with radix tooltip replace Fade
import { Fade, Tooltip } from '@stacks/ui';
import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Stack } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { FeeTypes } from '@shared/models/fees/fees.model';

import { useOnClickOutside } from '@app/common/hooks/use-onclickoutside';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';

import { FeeEstimateItem } from './fee-estimate-item';

const feesInfo =
  'Higher fees increase the likelihood of your transaction getting confirmed before others. Click to learn more.';
const url = 'https://hiro.so/questions/fee-estimates';

interface FeeEstimateSelectLayoutProps {
  children: ReactNode;
  isVisible: boolean;
  onSetIsSelectVisible(value: boolean): void;
  selectedItem: number;
}
export function FeeEstimateSelectLayout(props: FeeEstimateSelectLayoutProps) {
  const { children, isVisible, onSetIsSelectVisible, selectedItem } = props;
  const ref = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(ref, () => onSetIsSelectVisible(false));

  return (
    <>
      <Stack _hover={{ cursor: 'pointer' }}>
        <FeeEstimateItem
          index={selectedItem}
          onSelectItem={() => onSetIsSelectVisible(true)}
          selectedItem={FeeTypes.Middle}
        />
        <Fade in={isVisible}>
          {(styles: React.CSSProperties) => (
            <Stack
              bg={token('colors.accent.background-primary')}
              borderRadius="8px"
              boxShadow="high"
              data-testid={SharedComponentsSelectors.FeeEstimateSelect}
              flexDirection="column"
              minHeight="96px"
              minWidth="100px"
              overflow="hidden"
              p="space.01"
              position="absolute"
              ref={ref}
              style={styles}
              top="-35px"
              zIndex={9999}
            >
              {children}
            </Stack>
          )}
        </Fade>
      </Stack>
      <Tooltip label={feesInfo} placement="bottom">
        <Stack>
          <FiInfo
            color={token('colors.accent.text-subdued')}
            onClick={() => openInNewTab(url)}
            size="14px"
          />
        </Stack>
      </Tooltip>
    </>
  );
}
