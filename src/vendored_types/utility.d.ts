type Prettify<T> = {
  [K in keyof T]: T[K];
} & unknown;

type Thunk<T> = T | (() => T);