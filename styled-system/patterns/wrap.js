import { mapObject } from '../helpers.js';
import { css } from '../css/index.js';

const wrapConfig = {
transform(props) {
  const { columnGap, rowGap, gap = columnGap || rowGap ? void 0 : "10px", align, justify, ...rest } = props;
  return {
    display: "flex",
    flexWrap: "wrap",
    alignItems: align,
    justifyContent: justify,
    gap,
    columnGap,
    rowGap,
    ...rest
  };
}}

export const getWrapStyle = (styles = {}) => wrapConfig.transform(styles, { map: mapObject })

export const wrap = (styles) => css(getWrapStyle(styles))
wrap.raw = (styles) => styles