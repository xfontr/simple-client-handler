import { pino } from "pino";
import { replaceMethods } from "@personal/utils";
import { LOGGER_CUSTOM_STARTER } from "../configs/constants";

type TranslationsTool = (key: string) => string;

type Levels = "info" | "debug" | "trace" | "fatal" | "error" | "warn";

type AllowedLevels = {
  level: Levels;
};

const levels: Levels[] = ["info", "debug", "trace", "fatal", "error", "warn"];

const baseLogger = pino<AllowedLevels>({
  level: "info",
});

const hasCustomStarter = (text?: string) =>
  text?.startsWith(LOGGER_CUSTOM_STARTER);

const customLogger =
  (translationsTool?: TranslationsTool) =>
  <T extends object>(method: keyof T, item: T) =>
  (index?: string) =>
  (message: string): void => {
    if (hasCustomStarter(message) && translationsTool) {
      const translation = translationsTool(message.slice(1));
      item[method](index ? `${index} | ${translation}` : translation);
      return;
    }

    item[method](index ? `${index} | ${message}` : message);
  };

const initLogger = (translationsTool?: TranslationsTool) => (index?: string) =>
  replaceMethods(
    baseLogger,
    levels,
    customLogger(translationsTool),
    hasCustomStarter(index)
      ? translationsTool?.(index?.slice(1) ?? "") ?? index
      : index,
  );

export default initLogger;
