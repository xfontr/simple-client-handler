import { pino } from "pino";

type AllowedLevels = {
  level: "info" | "debug" | "trace";
};

const logger = pino<AllowedLevels>({
  level: "info",
});

export default logger;
