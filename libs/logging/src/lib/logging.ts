import winston, { createLogger, transports, format } from 'winston';
 
import winstonDailyRotateFile from 'winston-daily-rotate-file';

const enumerateErrorFormat = format(info => {
  if (info instanceof Error) {
    return Object.assign(
      {
        message: info.message,
        stack: info.stack,
      },
      info,
    );
  }

  return info;
});

const console = new transports.Console({ level: 'debug' });

const consoleRotateFile = new winstonDailyRotateFile({
  dirname: './logs',
  filename: 'app-console-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxFiles: '3d',
});
const mainConsole = new winston.transports.File({
  level: 'info',
  filename: './logs/all_logs.log',
  maxsize: 52428800, //50MB
  maxFiles: 5,
})

let option;
const customFormatter = format.combine(enumerateErrorFormat(), format.json());

switch (process.env.APP_ENV) {
  case 'development':
    option = {
      format: customFormatter,
      level: 'info',
      transports: [console],
    };
    break;
  case 'production':
    option = {
      format: customFormatter,
      level: 'warn',
      transports: [mainConsole],
    };
    break;
  default:
    option = {
      format: customFormatter,
      level: 'info',
      transports: [console],
    };
    break;
}

const logging = createLogger(option);


export { logging };