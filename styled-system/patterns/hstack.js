import { mapObject } from '../helpers.js';
import { css } from '../css/index.js';

const hstackConfig = {
transform(props) {
  const { justify, gap = "10px", ...rest } = props;
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: justify,
    gap,
    flexDirection: "row",
    ...rest
  };
}}

export const getHstackStyle = (styles = {}) => hstackConfig.transform(styles, { map: mapObject })

export const hstack = (styles) => css(getHstackStyle(styles))
hstack.raw = (styles) => styles