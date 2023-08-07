import { mapObject } from '../helpers.ts';
import { css } from '../css/index.ts';

const boxConfig = {
transform(props) {
  return props;
}}

export const getBoxStyle = (styles = {}) => boxConfig.transform(styles, { map: mapObject })

export const box = (styles) => css(getBoxStyle(styles))
box.raw = (styles) => styles