/* eslint-disable @typescript-eslint/ban-types */
import { pino } from "pino";
import { replaceMethods } from "../utils/methodReplacer";

type Levels = "info" | "debug" | "trace" | "fatal" | "error" | "warn";

type AllowedLevels = {
  level: Levels;
};

const levels: Levels[] = ["info", "debug", "trace", "fatal", "error", "warn"];

const baseLogger = pino<AllowedLevels>({
  level: "info",
});

const customLogger =
  <T extends object>(method: keyof T, item: T) =>
  (index?: string) =>
  (message: string): void => {
    item[method](index ? `${index} | ${message}` : message);
  };

const logger = (index?: string) =>
  replaceMethods(baseLogger, levels, customLogger, index);

export default logger;
