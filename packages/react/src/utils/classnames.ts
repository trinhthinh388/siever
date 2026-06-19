type ClassValue = string | number | boolean | null | undefined | ClassDictionary | ClassArray;

type ClassDictionary = Record<string, unknown>;
type ClassArray = ClassValue[];

const toValue = (mix: ClassValue): string => {
  if (!mix) return '';

  if (typeof mix === 'string' || typeof mix === 'number') {
    return String(mix);
  }

  if (Array.isArray(mix)) {
    return mix.map(toValue).filter(Boolean).join(' ');
  }

  if (typeof mix === 'object') {
    return Object.entries(mix)
      .filter(([, v]) => Boolean(v))
      .map(([k]) => k)
      .join(' ');
  }

  return '';
};

export const classNames = (...args: ClassValue[]): string =>
  args.map(toValue).filter(Boolean).join(' ');
