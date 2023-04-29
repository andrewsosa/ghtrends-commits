import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  transports: [
    new transports.Console({
      level: "debug",
      format: format.combine(
        // format.colorize(),
        format.splat(),
        format.simple(),
      ),
      silent: false,
    }),
  ],
  exitOnError: false,
});
// logger.emitErrs = true;
