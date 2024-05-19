type LogLevel = 'info' | 'log' | 'warn' | 'error' | 'debug';

interface LogEntry {
  readonly args: readonly any[];
  readonly date: Date;
  readonly logLevel: LogLevel;
}

export class Logger extends Array<LogEntry> {
  private ModName: string = 'DeepLib';

  constructor(modName?: string) {
    super();

    if (modName) {
      this.ModName = modName;
    }
  }

  private _Log(level: LogLevel, ...args: any[]): void {
    const logEntry: LogEntry = {
      logLevel: level,
      args: [...args],
      // trace: arguments.callee.caller.toString().split('\n'), 
      date: new Date(Date.now())
      // `[${this.ModName}] ${formattedArgs}` 
    };

    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('chrome') || userAgent.includes('firefox')) {
      const color = Logger.colorizeLog(level);
      args.forEach(arg => {
        if (typeof arg === 'string') {
          arg = `\n%c${arg}`;
          // args.splice(args.indexOf(arg), 1, arg, color);
        }
      });
      console.log(`%c${this.ModName}:`, color, ...args);
    } else {
      console.log(`${this.ModName}:`, ...args);
    }

    this.push(logEntry);
  }

  info(...args: any[]): void {
    this._Log('info', ...args);
  }

  log(...args: any[]): void {
    this._Log('log', ...args);
  }

  warn(...args: any[]): void {
    this._Log('warn', ...args);
  }

  error(...args: any[]): void {
    this._Log('error', ...args);
  }

  debug(...args: any[]): void {
    this._Log('debug', ...args);
  }

  static colorizeLog(logLevel: LogLevel): string {
    const colors: Record<LogLevel, string> = {
      info: 'color: #32CCCC',
      log: 'color: #CCCC32',
      warn: 'color: #eec355',
      error: 'color: #750b0b',
      debug: 'color: #9E4BCF',
    };

    return colors[logLevel];
  }
}

export const deepLibLogger = new Logger();
