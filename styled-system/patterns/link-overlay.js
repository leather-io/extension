import { mapObject } from '../helpers.js';
import { css } from '../css/index.js';

const linkOverlayConfig = {
transform(props) {
  return {
    position: "static",
    _before: {
      content: '""',
      display: "block",
      position: "absolute",
      cursor: "inherit",
      inset: "0",
      zIndex: "0",
      ...props["_before"]
    },
    ...props
  };
}}

export const getLinkOverlayStyle = (styles = {}) => linkOverlayConfig.transform(styles, { map: mapObject })

export const linkOverlay = (styles) => css(getLinkOverlayStyle(styles))
linkOverlay.raw = (styles) => styles