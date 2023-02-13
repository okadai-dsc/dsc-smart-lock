export interface Status {
  /** 電池残量 */
  batteryPercentage: number;
  /** 電池の電圧 */
  batteryVoltage: number;
  /** セサミデバイスの角度 */
  position: number;
  /** セサミデバイスの状態 */
  CHSesame2Status: 'locked' | 'unlocked' | 'moved';
  /** Sesame Shadow が更新された時間 */
  timestamp: number;
}

export enum ActionType {
  /** NOone */
  NONE,
  /** セサミデバイスが 施錠のBLEコマンド を受け付けた。 */
  BLE_LOCK,
  /** セサミデバイスが 解錠のBLEコマンド を受け付けた。 */
  BLE_UNLOCK,
  /** セサミデバイスの内部時計が校正された。 */
  TIME_CHANGED,
  /** オートロックの設定が変更された。 */
  AUTOLOCK_UPDATED,
  /** 施解錠角度の設定が変更された。 */
  MECHSETTING_UPDATED,
  /** セサミデバイスがオートロックした。 */
  AUTOLOCK,
  /** 手動で施錠された。 */
  MANUAL_LOCKED,
  /** 手動で解錠された。 */
  MANUAL_UNLOCKED,
  /** 解錠の範囲または施錠の範囲から、サムターンに動きがあった。 */
  MANUAL_ELSE,
  /** モーターが確実に施錠した。 */
  DRIVE_LOCKED,
  /** モーターが確実に解錠した。 */
  DRIVE_UNLOCKED,
  /** モーターが施解錠の途中に失敗した。 */
  DRIVEFAILED,
  /** セサミデバイスが発信しているBLEアドバタイシング の INTERVAL と TXPOWER の設定が変更された。 */
  BLE_ADVPARAMETERUPDATED,
  /** WiFiモジュールを経由してセサミデバイスを施錠された。 */
  WM2_LOCK,
  /** WiFiモジュールを経由してセサミデバイスを解錠された。 */
  WM2_UNLOCK,
  /** Web APIを経由してセサミデバイスを施錠した。 */
  WEB_LOCK,
  /** Web APIを経由してセサミデバイスを解錠した。 */
  WEB_UNLOCK,
}

/**
 * 施錠
 */
export type ActionType_Lock =
  | ActionType.BLE_LOCK
  | ActionType.AUTOLOCK
  | ActionType.MANUAL_LOCKED
  | ActionType.DRIVE_LOCKED
  | ActionType.WM2_LOCK
  | ActionType.WEB_LOCK;

/**
 * 解錠
 */
export type ActionType_UnLock =
  | ActionType.BLE_UNLOCK
  | ActionType.MANUAL_UNLOCKED
  | ActionType.DRIVE_UNLOCKED
  | ActionType.WM2_UNLOCK
  | ActionType.WEB_UNLOCK;

export interface History {
  type: ActionType;
  /** 1979/1/1 00:00:00 からミリ秒単位のタイムスタンプ */
  timeStamp: number;
  /** 鍵についているタグやメモ */
  historyTag: string;
  /** 連続でない, セサミデバイスが再起動するまで当履歴の唯1つのID */
  recordID: number;
  /** 不明 */
  parameter: null;
}

export enum ActionCommand {
  TOGGLE = 88,
  LOCK = 82,
  UNLOCK = 83,
}
