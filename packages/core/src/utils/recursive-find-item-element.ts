const isItemElement = (element: Element) =>
  element.getAttribute('data-component') === 'siever' &&
  element.getAttribute('data-slot') === 'item';

export const recursiveFindItemElement = (
  element: EventTarget | HTMLElement | HTMLDivElement | null,
): HTMLElement | null => {
  if (!element) return null;
  if (element instanceof HTMLElement) {
    if (isItemElement(element)) return element;
    return recursiveFindItemElement(element.parentElement);
  }
  return null;
};
