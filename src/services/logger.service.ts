const {
  format: { printf, timestamp, combine, colorize },
  transports,
  createLogger,
} = require("winston");
import moment from "moment-timezone";

const level = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 5,
};

const logFormat = printf(
  // ({ level, message, timestamp: ts }: any) => `${ts} [${level}]: ${message}`,
  ({ level, message, timestamp: ts }: any) =>
    `[${moment(new Date())
      .tz("Asia/Kolkata")
      .format("DD-MM-YYYY hh:mm:ss A")}] [${level}]: ${message}`
);

const format = combine(timestamp(), colorize({ all: true }), logFormat);

const config = {
  level,
  format,
  transports: [new transports.Console({ level: "debug" })],
};

/**
 * Internal
 * @param {Object} message object to format
 * @returns {String} in format " key: value, "
 */
const removeEscapeCharacters = (message: any) => {
  // stringify return undefined type when passed undefined, returning empty string instead
  let value = message;
  if (message instanceof Error) {
    value = message.message + message.stack;
  }
  // stringify return undefined type when passed undefined, returning empty string instead
  const stringified = JSON.stringify(value) || "";

  // return stringified.replace(/\\/g, '');
  return stringified;
  // return value;
};

/**
 *
 * @param {Array} messages containing text to print
 */
const formatLogMessages = (messages: any) => {
  let returnValue = "";

  for (let i = 0; i < messages.length; ++i) {
    const item = messages[i];
    returnValue += removeEscapeCharacters(item);
  }

  return returnValue;
};

const winston = createLogger(config);

/**
 *
 * formats and logs message
 * @param {Number} type
 * @param  {...any} messages
 */
const log = (type: any, ...messages: any) => {
  const message = formatLogMessages(messages);

  switch (type) {
    case level.warn:
      winston.warn(message);
      break;

    case level.info:
      winston.info(message);
      break;

    case level.debug:
      winston.debug(message);
      break;

    case level.error:
      winston.error(message);
      break;

    // can throw error here TBD
    default:
      break;
  }
};

const logger = {
  info: log.bind(null, level.info),
  warn: log.bind(null, level.warn),
  debug: log.bind(null, level.debug),
  error: log.bind(null, level.error),
};

export default logger;
