/* eslint-disable @typescript-eslint/ban-types */
import { type CustomFunction } from "../types/Functions";

export const replaceMethods = <T extends object, M extends CustomFunction>(
  methodContainer: T,
  methods: Array<keyof T>,
  customMethod: M,
  ...args: Parameters<ReturnType<M>>
): T =>
  methods.reduce(
    (customLevels, method) => ({
      ...customLevels,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      [method]: customMethod(method, methodContainer)(...args),
    }),
    {},
  ) as T;
