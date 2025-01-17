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

export function exportToGlobal(name: string, value: any): void {
  const keys = name.split('.');
  let current = globalThis as any;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }

  current[keys[keys.length - 1]] = value;
}
