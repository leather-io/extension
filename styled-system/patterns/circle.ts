import { mapObject } from '../helpers.ts';
import { css } from '../css/index.ts';

const circleConfig = {
transform(props) {
  const { size, ...rest } = props;
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: "0 0 auto",
    width: size,
    height: size,
    borderRadius: "9999px",
    ...rest
  };
}}

export const getCircleStyle = (styles = {}) => circleConfig.transform(styles, { map: mapObject })

export const circle = (styles) => css(getCircleStyle(styles))
circle.raw = (styles) => styles