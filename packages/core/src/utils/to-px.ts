export const toPx = (n: number) => `${n}px`;
export const fromPxToNumber = (str: string | null) =>
  !str ? 0 : parseFloat(str.replace('px', ''));
