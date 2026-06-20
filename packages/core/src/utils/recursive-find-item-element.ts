const isItemElement = (element: Element) =>
  element.getAttribute('data-component') === 'siever' &&
  element.getAttribute('data-slot') === 'item';

export const recursiveFindItemElement = (element: HTMLElement | null): HTMLElement | null => {
  if (!element) return null;
  if (isItemElement(element)) return element;
  return recursiveFindItemElement(element.parentElement);
};
