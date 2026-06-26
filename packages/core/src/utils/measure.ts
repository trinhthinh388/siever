import type { Dimension } from '../types';
import { fromPxToNumber } from './to-px';

export const measure = (element: HTMLElement): Dimension => {
  const {
    top,
    left,
    width,
    height,
    paddingTop,
    paddingLeft,
    paddingRight,
    paddingBottom,
    borderTopWidth,
    borderLeftWidth,
    borderRightWidth,
    borderBottomWidth,
  } = window.getComputedStyle(element);

  const { x, y } = element.getBoundingClientRect();

  const w = fromPxToNumber(width);
  const h = fromPxToNumber(height);
  const pTop = fromPxToNumber(paddingTop);
  const pRight = fromPxToNumber(paddingRight);
  const pBottom = fromPxToNumber(paddingBottom);
  const pLeft = fromPxToNumber(paddingLeft);

  return {
    x,
    y,
    width: w,
    height: h,
    paddingTop: pTop,
    paddingLeft: pLeft,
    paddingRight: pRight,
    paddingBottom: pBottom,
    top: fromPxToNumber(top),
    left: fromPxToNumber(left),
    contentWidth:
      w - fromPxToNumber(borderLeftWidth) - fromPxToNumber(borderRightWidth) - pLeft - pRight,
    contentHeight:
      h - fromPxToNumber(borderTopWidth) - fromPxToNumber(borderBottomWidth) - pTop - pBottom,
  };
};
