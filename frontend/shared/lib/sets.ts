export const setToArray = (set: Set<any>, serializer?: (v: unknown) => unknown) => {
  return [...set.entries()].map((e) => serializer?.(e[0]) || e[0]);
};