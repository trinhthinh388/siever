export const generateId = (prefix = 'siever_') => {
  const randomString = Math.random().toString(36).substring(2, 10);
  return `${prefix}-${randomString}`;
};
