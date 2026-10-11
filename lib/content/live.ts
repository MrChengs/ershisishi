export function liveArray<T>(read: () => T[]): T[] {
  return new Proxy([] as T[], {
    get(_target, prop) {
      const list = read();
      const value = Reflect.get(list, prop, list);
      if (typeof value === "function") {
        return (value as (...args: unknown[]) => unknown).bind(list);
      }
      return value;
    },
    has(_target, prop) {
      return Reflect.has(read(), prop);
    },
    ownKeys() {
      return Reflect.ownKeys(read());
    },
    getOwnPropertyDescriptor(_target, prop) {
      return Reflect.getOwnPropertyDescriptor(read(), prop);
    },
  });
}
