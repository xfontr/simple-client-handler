import i18n from "@personal/i18n";
import { LOCALES } from "./configs/constants";
import initLogger from "./services/logger";

const $t = i18n({
  locale: "GB-en",
  fallbackLocale: "GB-en",
  anyFallback: true,
  autoInit: true,
  allowedLocales: LOCALES,
  route: [__dirname, "./locales"],
  log: {
    enabled: true,
    loggerTool: initLogger()("I18n").warn,
    verbosity: ["CRITIC", "LIGHT", "SUCCESS"],
  },
  beforeAll: ({ translations }) => {
    const home = translations["directory"].home as string;
    translations["directory"].home = home.toUpperCase();
  },
  plugins: [],
}).useI18n();

export default $t;
