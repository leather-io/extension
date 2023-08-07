import { mapObject } from '../helpers.js';
import { css } from '../css/index.js';

const containerConfig = {
transform(props) {
  return {
    position: "relative",
    maxWidth: "8xl",
    mx: "auto",
    px: { base: "4", md: "6", lg: "8" },
    ...props
  };
}}

export const getContainerStyle = (styles = {}) => containerConfig.transform(styles, { map: mapObject })

export const container = (styles) => css(getContainerStyle(styles))
container.raw = (styles) => styles