import { fromPxToNumber } from './to-px';

export const measure = (element: HTMLElement) => {
  const {
    x,
    y,
    width,
    height,
    borderTop,
    borderLeft,
    paddingTop,
    borderRight,
    paddingLeft,
    borderBottom,
    paddingRight,
    paddingBottom,
  } = window.getComputedStyle(element);
  return {
    x: fromPxToNumber(x),
    y: fromPxToNumber(y),
    width: fromPxToNumber(width),
    height: fromPxToNumber(height),
    paddingTop: fromPxToNumber(paddingTop),
    paddingLeft: fromPxToNumber(paddingLeft),
    paddingRight: fromPxToNumber(paddingRight),
    paddingBottom: fromPxToNumber(paddingBottom),
    contentWidth:
      fromPxToNumber(width) -
      fromPxToNumber(borderLeft) -
      fromPxToNumber(borderRight) -
      fromPxToNumber(paddingLeft) -
      fromPxToNumber(paddingRight),
    contentHeight:
      fromPxToNumber(height) -
      fromPxToNumber(borderTop) -
      fromPxToNumber(borderBottom) -
      fromPxToNumber(paddingTop) -
      fromPxToNumber(paddingBottom),
  };
};
