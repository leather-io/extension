import { mapObject } from '../helpers.js';
import { css } from '../css/index.js';

const centerConfig = {
transform(props) {
  const { inline, ...rest } = props;
  return {
    display: inline ? "inline-flex" : "flex",
    alignItems: "center",
    justifyContent: "center",
    ...rest
  };
}}

export const getCenterStyle = (styles = {}) => centerConfig.transform(styles, { map: mapObject })

export const center = (styles) => css(getCenterStyle(styles))
center.raw = (styles) => styles