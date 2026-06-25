import type { Dimension } from '../types';
import { fromPxToNumber } from './to-px';

export const measure = (element: HTMLElement): Dimension => {
  const {
    x,
    y,
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

  const w = fromPxToNumber(width);
  const h = fromPxToNumber(height);
  const pTop = fromPxToNumber(paddingTop);
  const pRight = fromPxToNumber(paddingRight);
  const pBottom = fromPxToNumber(paddingBottom);
  const pLeft = fromPxToNumber(paddingLeft);

  return {
    width: w,
    height: h,
    paddingTop: pTop,
    paddingLeft: pLeft,
    x: fromPxToNumber(x),
    y: fromPxToNumber(y),
    paddingRight: pRight,
    paddingBottom: pBottom,
    contentWidth:
      w - fromPxToNumber(borderLeftWidth) - fromPxToNumber(borderRightWidth) - pLeft - pRight,
    contentHeight:
      h - fromPxToNumber(borderTopWidth) - fromPxToNumber(borderBottomWidth) - pTop - pBottom,
  };
};
