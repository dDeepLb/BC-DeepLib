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

export function shuffleArray(array: string[]) {
  const temp: string[] = JSON.parse(JSON.stringify(array));
  const ret: string[] = [];

  while (temp.length > 0) {
    const d = Math.floor(Math.random() * temp.length);
    ret.push(temp[d]);
    temp.splice(d, 1);
  }

  return ret;
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

/** Merges matching properties from `mergeFrom` into `mergeTo`. */
export function deepMergeMatchingProperties<T extends object>(mergeTo: T, mergeFrom: T): T  {
  const mergedObject = { ...mergeTo };

  for (const key in mergeFrom) {
    if (mergeFrom[key] !== null && typeof mergeFrom[key] === 'object') {
      (mergedObject as any)[key] = deepMergeMatchingProperties(mergedObject[key] || {}, mergeFrom[key]);
    } else if (key in mergedObject) {
      (mergedObject as any)[key] = mergeFrom[key];
    }
  }

  return mergedObject;
}

export function hasGetter<T extends object>(obj: T, prop: keyof T | string): boolean {
  while (obj && obj !== Object.prototype) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    if (descriptor?.get) return true;
    obj = Object.getPrototypeOf(obj);
  }
  return false;
}

export function hasSetter<T extends object>(obj: T, prop: keyof T | string): boolean {
  while (obj && obj !== Object.prototype) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    if (descriptor?.set) return true;
    obj = Object.getPrototypeOf(obj);
  }
  return false;
}