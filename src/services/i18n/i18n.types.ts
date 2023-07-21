export type Locale = `${Uppercase<string>}-${Lowercase<string>}`;
export type Locales = Readonly<Locale[]>;

export type VerbosityLevels = "CRITIC" | "LIGHT" | "SUCCESS" | "MESSAGE";

export type I18nLogger = (
  options: Required<PublicLogOptions>,
) => ((message: string, level: VerbosityLevels) => void) | (() => void);

export type LogOptions = Partial<{
  /**
   * Function provided to log a message in the console.
   * @default console.warn
   */
  loggerTool: Function;
  /**
   * Custom log function provided by the tool. Becomes readonly once the store inits.
   * @readonly
   */
  logger: ReturnType<I18nLogger>;
  /**
   * Allows the user to set what sort of messages wants to see logged.
   * @argument CRITIC Relevant (not app-breaking) errors and other important messages.
   * @argument LIGHT Informative messages or light errors.
   * @argument MESSAGE Every time the tool is called, will show the translation
   * @argument ALL Will simply log everything
   */
  verbosity: VerbosityLevels[] | "ALL";
  /**
   * Toggles the logger.
   */
  enabled: boolean;
}>;

export type PublicLogOptions = Omit<LogOptions, "logger">;

export type I18nOptions = Partial<{
  /**
   * Inits the store when using the localization tool, if it hasn't been instantiated before.
   * If false, it will be required to manually init it.
   * @default false
   */
  autoInit: boolean;
  /**
   * @default "GB-en"
   */
  locale: Locale;
  /**
   * @default "GB-en"
   */
  fallbackLocale: Locale;
  /**
   * @default ["GB-en"]
   */
  allowedLocales: Locales;
  /**
   * If translations are not found anywhere, the tool will search for any localization file in the route.
   * Could lead to unexpected behavior, as it will load the first found .json file, if any.
   * @default false
   */
  anyFallback: boolean;
  route: string;
  log: PublicLogOptions;
}>;

export type I18nStore = Required<
  {
    translations: Record<string, any>;
  } & Required<I18nOptions> & {
      log: Required<LogOptions>;
    }
>;
