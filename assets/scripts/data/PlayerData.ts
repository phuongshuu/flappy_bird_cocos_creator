export interface Opponent {
    id: number;
    displayName: string,
    gold: number
}


export default class PlayerData {
    private _coin: number;
    public get coin(): number {
        return this._coin;
    }
    public set coin(value: number) {
        this._coin = value;
    }
  
    private _rankPoint: number;
    public get rankPoint(): number {
        return this._rankPoint;
    }
    public set rankPoint(value: number) {
        this._rankPoint = value;
    }
    private _shieldTimes: number;
    public get shieldTimes(): number {
        return this._shieldTimes;
    }
    public set shieldTimes(value: number) {
        this._shieldTimes = value;
    }
    private _displayName: string;
    public get displayName(): string {
        return this._displayName;
    }
    public set displayName(value: string) {
        this._displayName = value;
    }
    private _id: number;
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }
    private _energies: number;
    public get energies(): number {
        return this._energies;
    }
    public set energies(value: number) {
        this._energies = value;
    }
    private _timeBeforeReceiveEnergy: number;
    public get timeBeforeReceiveEnergy(): number {
        return this._timeBeforeReceiveEnergy;
    }
    public set timeBeforeReceiveEnergy(value: number) {
        this._timeBeforeReceiveEnergy = value;
    }
    private _curLevel: number;
    public get curLevel(): number {
        return this._curLevel;
    }
    public set curLevel(value: number) {
        this._curLevel = value;
    }
    
    private _openedPicecesId: Array<number>;
    public get openedPicecesId(): Array<number> {
        return this._openedPicecesId;
    }
    public set openedPicecesId(value: Array<number>) {
        this._openedPicecesId = value;
    }
    private _avatarUrl: string;
    public get avatarUrl(): string {
        return this._avatarUrl;
    }
    public set avatarUrl(value: string) {
        this._avatarUrl = value;
    }
    private _curOpponent: Opponent;
    public get curOpponent(): Opponent {
        return this._curOpponent;
    }
    public set curOpponent(value: Opponent) {
        this._curOpponent = value;
    }
    private static _instance: PlayerData;
    static get instance () {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new PlayerData();
        return this._instance;
    }
    constructor() {
        this.resetData();
    }
    resetData(): void {
        this._coin = 0;
        this._rankPoint = 0;
        this._shieldTimes = 0;
        this._displayName = "Default User";
        this._id = 0;
        this._energies = 0;
        this._timeBeforeReceiveEnergy = 0;
        this._curLevel = 0;
        this._openedPicecesId = [];
    }
}