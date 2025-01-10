export function deepMerge(target: any, source: any): any {
  if (target === undefined) return source;
  if (source === undefined) return target;
  if (typeof target !== 'object' || typeof source !== 'object') {
    return source;
  }

  for (const key of Object.keys(source)) {
    if (Array.isArray(source[key]) && Array.isArray(target[key])) {
      target[key] = [...target[key], ...source[key]];
    } else if (typeof source[key] === 'object' && source[key] !== null) {
      target[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }

  return target;
}
