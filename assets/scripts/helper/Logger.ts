import { _decorator, Enum, log, warn, error } from "cc";

export enum LogLevel {
    Info,
    Debug,
    Warn,
    Error
}


Enum(LogLevel)

export class Logger {
    module: string;
    constructor(module: string) {
        this.module = module;
    }
    createLog(any) : string {
        let ret = "";
        for (let i = 0; i < arguments[0].length; ++i) {
            ret += " ";
            let type = typeof arguments[0][i];
            if (type === 'string' || type === 'number') {
                ret += arguments[0][i];
                continue;
            }
            ret += "("  + type + ")" +  JSON.stringify(arguments[0][i]); 
        }
        return ret;
    }
    debug(message?: any, ...optionalParams: any[]) {
        if (!LogManager.canLog(LogLevel.Debug)) return;
        const s = "[DEBUG][" + this.module + "] " +  this.createLog(arguments);
        log(s);
    }
    info(message?: any, ...optionalParams: any[]) {
        if (!LogManager.canLog(LogLevel.Debug)) return;
        const s = "[INFO ][" + this.module + "] " + this.createLog(arguments);
        log(s);
    }
    warn(message?: any, ...optionalParams: any[]) {
        if (!LogManager.canLog(LogLevel.Debug)) return;
        const s = "[WARN ][" + this.module + "] " + this.createLog(arguments);
        warn(s);
    }
    error(message?: any, ...optionalParams: any[]) {
        if (!LogManager.canLog(LogLevel.Debug)) return;
        const s = "[ERROR][" + this.module + "] " + this.createLog(arguments);
        error(s);
    }

}

export default class LogManager {
    static loggers: Map<string, Logger> = new Map();
    static log_level: LogLevel = LogLevel.Error;
    public static globalLog: Logger = new Logger("Global Log");
    public static getLogger(moduleName: string) {
        let logger = this.loggers.get(moduleName);
        if (logger != null) return logger;
        logger = new Logger(moduleName);
        this.loggers.set(moduleName, logger);
        log("[LogManager] Created new Logger for " + moduleName);
        return logger;
    }

    public static canLog(logLevel: LogLevel) {
        return this.log_level >= logLevel;
    }

}