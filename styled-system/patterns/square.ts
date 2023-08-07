import { mapObject } from '../helpers.ts';
import { css } from '../css/index.ts';

const squareConfig = {
transform(props) {
  const { size, ...rest } = props;
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: "0 0 auto",
    width: size,
    height: size,
    ...rest
  };
}}

export const getSquareStyle = (styles = {}) => squareConfig.transform(styles, { map: mapObject })

export const square = (styles) => css(getSquareStyle(styles))
square.raw = (styles) => styles