import { LOCALES } from "./configs/constants";
import logger from "./services/logger";
import i18n from "@personal/i18n";

const $t = i18n({
  locale: "GB-en",
  fallbackLocale: "GB-en",
  anyFallback: true,
  autoInit: true,
  allowedLocales: LOCALES,
  log: {
    enabled: true,
    loggerTool: logger("I18n").warn,
    verbosity: ["CRITIC", "LIGHT", "SUCCESS"],
  },
  beforeAll: ({ translations }) => {
    const home = translations["directory"].home as string;
    translations["directory"].home = home.toUpperCase();
  },
  plugins: [],
}).useI18n();

export default $t;
