import internalI18n from "./i18n.locales";
import type {
  I18nInstance,
  I18nOptions,
  I18nStore,
  Locale,
  Plugin,
  PublicLogOptions,
} from "./i18n.types";
import { i18nLogger, loadTranslations, requiredLocale } from "./i18n.utils";

// eslint-disable-next-line @typescript-eslint/naming-convention
const DEFAULT_LOCALE: Locale = "GB-en";

let isInitialized = false;

const i18n = <T extends string | number | symbol>(
  options: I18nOptions = {},
): I18nInstance<T> => {
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
    beforeAll: undefined,
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

  if (isInitialized) {
    throw new Error($t.initializedError);
  }

  const init = () => {
    if (isInitialized) {
      throw new Error($t.initializedError);
    }

    const [file, error] = loadTranslations(store);

    if (error) {
      throw new Error($t.fileError);
    }

    log($t.initSuccess(), "SUCCESS");

    isInitialized = true;
    store.translations = JSON.parse(file!) as Record<string, any>;

    store.beforeAll?.(store);

    Object.freeze(store);

    return { useI18n, plugins };
  };

  const useI18n = () => {
    if (!isInitialized && !store.autoInit) {
      throw new Error($t.notInitializedError);
    }

    if (!isInitialized) {
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

  const plugins = () => {
    if (!isInitialized) {
      throw new Error($t.notInitializedError);
    }

    return store.plugins.reduce(
      (allPlugins, plugin) => ({
        ...allPlugins,
        [plugin.name as T]: plugin(store),
      }),
      // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
      {} as Record<T, Plugin>,
    );
  };

  return { init, useI18n, plugins };
};

export default i18n;
