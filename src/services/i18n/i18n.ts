import internalI18n from "./i18n.locales";
import type {
  I18nOptions,
  I18nStore,
  Locale,
  PublicLogOptions,
} from "./i18n.types";
import { i18nLogger, loadTranslations, requiredLocale } from "./i18n.utils";

// eslint-disable-next-line @typescript-eslint/naming-convention
const DEFAULT_LOCALE: Locale = "GB-en";

let hasBeenInitialized = false;

const i18n = (options: I18nOptions = {}) => {
  const { locale, allowedLocales, fallbackLocale } = options;

  const logOptions: Required<PublicLogOptions> = {
    enabled: true,
    verbosity: "ALL",
    loggerTool: console.warn,
    ...options.log,
  };

  const store: I18nStore = {
    autoInit: false,
    allowedLocales: [DEFAULT_LOCALE],
    fallbackLocale: DEFAULT_LOCALE,
    anyFallback: false,
    route: "../../locales",
    locale: requiredLocale(
      locale ?? DEFAULT_LOCALE,
      allowedLocales ?? [DEFAULT_LOCALE],
      fallbackLocale ?? DEFAULT_LOCALE,
    ),
    translations: {},
    plugins: [],
    ...options,
    log: {
      logger: i18nLogger(logOptions),
      ...logOptions,
    },
  };

  const $t = internalI18n(store);

  Object.freeze(store.log);

  const log = store.log.logger;

  const init = () => {
    if (hasBeenInitialized) {
      throw new Error($t.initializedError);
    }

    const [file, error] = loadTranslations(store);

    if (error) {
      throw new Error($t.fileError);
    }

    log($t.initSuccess(), "SUCCESS");

    hasBeenInitialized = true;
    store.translations = JSON.parse(file!) as Record<string, any>;

    executePlugins();

    Object.freeze(store);

    return { useI18n };
  };

  const executePlugins = () => {
    store.plugins.forEach((plugin) => {
      plugin(store);
    });
  };

  const useI18n = () => {
    if (!hasBeenInitialized && !store.autoInit) {
      throw new Error($t.notInitializedError);
    }

    if (!hasBeenInitialized) {
      init();
    }

    return (key: string): string => {
      const translation = key
        .split(".")
        .reduce(
          (value, currentKey) =>
            (value?.[currentKey] ?? value) as Record<string, any>,
          store.translations,
        );

      if (translation && typeof translation === "string") {
        log(translation, "MESSAGE");
        return translation;
      }

      const warnMessage = `${store.locale} - ${$t.missingKey(key)}`;

      if (store.log.verbosity.includes("MESSAGE")) {
        log(warnMessage, "CRITIC");
      }

      return warnMessage;
    };
  };

  return { init, useI18n };
};

export default i18n;
