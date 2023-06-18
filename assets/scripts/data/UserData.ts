import { _decorator, Enum, sys } from "cc";
import LogManager, { Logger } from "../helper/Logger";

export enum UserDataType {
  LastPlayTime,
  LastPlayBird
};

export enum TimePlay {
  Day,
  Night
}

Enum(TimePlay);

Enum(UserDataType);



export default class UserDataHelper {
  private static logger: Logger = LogManager.getLogger("UserDataHelper");
  public static saveString(key: UserDataType, val: string) {
    if (val == null) {
      this.logger.error("Value is not valid");
      return;
    }
    sys.localStorage.setItem(key + "", val);
    this.logger.debug("Set " + UserDataType[key] + " to " + val);
  }

  public static getString(key: UserDataType) : string {
    this.logger.debug("Get Value for " + UserDataType[key]);
    const ret = sys.localStorage.getItem(key + "");
    if (ret == null) {
      this.logger.error("No value for key " + UserDataType[key]);
      return null;
    }
    return ret;
  }
}