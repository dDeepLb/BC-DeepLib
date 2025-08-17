/**
 * Deeply merges properties from `source` into `target`.
 * - If both target and source properties are arrays, concatenates them.
 * - If both are objects, recursively merges them.
 * - Otherwise, source overwrites target.
 */
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


/**
 * Returns a new array with elements of the input array shuffled.
 * Uses something-something shuffle algorithm by splicing from a cloned array.
 */
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

/**
 * Exports a value to the global object under a nested namespace path.
 * Creates intermediate objects if they do not exist.
 * 
 * Example: `exportToGlobal('MyMod.Utils', value)` creates `globalThis.MyMod.Utils = value`.
 */
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


/**
 * Deeply merges only matching properties from `mergeFrom` into `mergeTo`.
 * Properties not present in `mergeTo` are ignored.
 * Objects are recursively merged, primitive properties overwritten.
 */
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

/** Checks if the given property has a getter defined on the object or its prototype chain. */
export function hasGetter<T extends object>(obj: T, prop: keyof T | string): boolean {
  while (obj && obj !== Object.prototype) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    if (descriptor?.get) return true;
    obj = Object.getPrototypeOf(obj);
  }
  return false;
}

/** Checks if the given property has a setter defined on the object or its prototype chain. */
export function hasSetter<T extends object>(obj: T, prop: keyof T | string): boolean {
  while (obj && obj !== Object.prototype) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    if (descriptor?.set) return true;
    obj = Object.getPrototypeOf(obj);
  }
  return false;
}

/**
 * Converts bytes to kilobytes. 
 */
export const byteToKB = (nByte: number) => Math.round(nByte / 100) / 10;
