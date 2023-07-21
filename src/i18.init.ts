import { LOCALES } from "./configs/constants";
import i18n from "./services/i18n/i18n";
import logger from "./services/logger";

const $t = i18n({
  locale: "GB-en",
  fallbackLocale: "GB-en",
  anyFallback: false,
  autoInit: true,
  allowedLocales: LOCALES,
  log: {
    enabled: true,
    loggerTool: logger("I18n").warn,
    verbosity: ["CRITIC", "LIGHT", "SUCCESS"],
  },
  plugins: [],
}).useI18n();

export default $t;
