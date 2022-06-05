export function groupBy<T>(
  elements: T[],
  key: (value: T, index: number, array: T[]) => string
): { [index: string]: T[] } {
  let ret: { [index: string]: T[] } = {};

  elements.forEach((value, index, array) => {
    const keyValue = key(value, index, array);
    if (!(keyValue in ret)) ret[keyValue] = Array<T>();
    ret[keyValue].push(value);
  });

  return ret;
}
