export const measure = (element: HTMLElement) => {
  const { width, height, borderTop, borderLeft, borderRight, borderBottom } =
    window.getComputedStyle(element);
  return {
    width:
      parseFloat(width.replace('px', '')) -
      parseFloat(borderLeft.replace('px', '')) -
      parseFloat(borderRight.replace('px', '')),
    height:
      parseFloat(height.replace('px', '')) -
      parseFloat(borderTop.replace('px', '')) -
      parseFloat(borderBottom.replace('px', '')),
  };
};
