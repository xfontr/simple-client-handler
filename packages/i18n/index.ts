import type {
  I18nInstance,
  I18nLogger,
  I18nOptions,
  I18nStore,
  Locale as I18nLocale,
  Locales as I18nLocales,
  Plugin as I18nPlugin,
  VerbosityLevels as I18nVerbosityLevels,
  PublicLogOptions as I18nLogOptions,
} from "./src/i18n.types";

import * as i18n from "./src/i18n";

export type {
  I18nInstance,
  I18nLogger,
  I18nOptions,
  I18nStore,
  I18nLocale,
  I18nLocales,
  I18nPlugin,
  I18nVerbosityLevels,
  I18nLogOptions,
};

export { i18n };
