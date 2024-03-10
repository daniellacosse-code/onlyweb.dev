const MAX_MESSAGE_LENGTH = 128;
const MAX_DETAIL_LENGTH = 256;

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  data: 2,
  warn: 3,
  error: 4,
  critical: 5
};

const Log = ({ message, detail, level = "info" }) => {
  const logObject = {
    m: message.slice(0, MAX_MESSAGE_LENGTH),
    o: new Date().toISOString(),
    l: LOG_LEVELS[level]
  };

  if (detail) {
    logObject.d = JSON.stringify(detail).slice(0, MAX_DETAIL_LENGTH);
  }

  console[level](logObject);
};

export const LogError = (error) =>
  Log({ message: error.message, detail: error, level: "error" });
export default Log;
