import { readFileSync, readdirSync } from "fs";
import { join, extname } from "path";
import type {
  I18nLogger,
  I18nStore,
  Locale,
  Locales,
  VerbosityLevels,
} from "./i18n.types";
import { type CustomFunction } from "../../types/Functions";
import internalI18n from "./i18n.locales";

export const syncTryCatch = <
  R,
  T extends CustomFunction<R> = CustomFunction<R>,
>(
  callback: T,
  ...args: Parameters<T>
): [R | undefined, undefined | unknown] => {
  try {
    const response = callback(...args);
    return [response, undefined];
  } catch (error) {
    return [undefined, error];
  }
};

export const requiredLocale = (
  selectedLocale: Locale,
  allowedLocales: Locales,
  fallbackLocale: Locale,
) =>
  allowedLocales.find((locale) => selectedLocale === locale) ?? fallbackLocale;

const getTranslation = (locale: Locale, route: string) =>
  syncTryCatch<string>(
    readFileSync,
    join(__dirname, route, `${locale}.json`),
    "utf8",
  );

const getAnyTranslation = (route: string): Locale | undefined => {
  const [translationsFolder, error] = syncTryCatch<string[]>(
    readdirSync,
    join(__dirname, route),
  );

  return error
    ? undefined
    : (translationsFolder
        ?.find((name) => extname(name) === ".json")
        ?.split(".")[0] as Locale);
};

export const loadTranslations = (store: I18nStore) => {
  const { locale, route, fallbackLocale } = store;
  const { logger } = store.log;
  const $t = internalI18n(store);

  const response = getTranslation(locale, route);

  if (response[1]) {
    logger($t.requestedLocaleError, "LIGHT");
    const defaultResponse = getTranslation(fallbackLocale, route);

    if (defaultResponse[1] && store.anyFallback) {
      logger($t.fallbackLocaleError, "LIGHT");
      const emergencyFallback = getAnyTranslation(route);

      if (!emergencyFallback) {
        logger($t.emergencyLocaleError, "LIGHT");
        return defaultResponse;
      }

      const emergencyResponse = getTranslation(emergencyFallback, route);

      store.locale = emergencyFallback;
      logger($t.emergencyLocale(), "LIGHT");
      return emergencyResponse;
    }

    store.locale = fallbackLocale;
    logger($t.fallbackLocale(), "LIGHT");
    return defaultResponse;
  }

  return response;
};

export const i18nLogger: I18nLogger = ({ enabled, loggerTool, verbosity }) => {
  const emojis: Record<Lowercase<VerbosityLevels>, string> = {
    critic: "❗",
    light: "❕",
    message: "💬",
    success: "✅",
  };

  return enabled
    ? (message: string, level: VerbosityLevels): void => {
        if (!(verbosity === "ALL" || verbosity.includes(level))) {
          return;
        }

        loggerTool(
          `${
            emojis[level.toLowerCase() as Lowercase<VerbosityLevels>]
          } ${message}`,
        );
      }
    : (): void => undefined;
};
