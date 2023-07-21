import $t from "./i18.init";
import logger from "./services/logger";

const { info } = logger($t("directory.home"));

info($t("app.init"));
