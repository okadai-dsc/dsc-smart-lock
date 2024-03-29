import { ActionCommand, Status } from '@/models/Sesame';
import generateRandomTag from '@/utils/generateRandomTag';
import axios from 'axios';

export class SesameAPI {
  private static apiKey: string;
  private static deviceId: string;
  private static secretKey: string;

  static initialize(apiKey: string, deviceId: string, secretKey: string) {
    SesameAPI.apiKey = apiKey;
    SesameAPI.deviceId = deviceId;
    SesameAPI.secretKey = secretKey;
  }

  /**
   * Sesame のステータスを取得する。
   * @returns Sesame のステータス
   */
  static async getStatus(): Promise<Status> {
    const res = await axios.get<Status>(
      `https://app.candyhouse.co/api/sesame2/${SesameAPI.deviceId}`,
      {
        headers: {
          'x-api-key': SesameAPI.apiKey,
        },
      },
    );
    return res.data;
  }

  /**
   * Sesame の履歴を取得する。
   *
   * @param page ページ数。ページ数の0から、新→旧の履歴順番で、1ページの中に最多50件の履歴が入る。
   * @param length 指定されたページの中に、新→旧の履歴順番で取得したい履歴件数。
   * @returns 履歴の配列
   */
  static async getHistory(page: number, length = 10): Promise<History[]> {
    const res = await axios.get<History[]>(
      `https://app.candyhouse.co/api/sesame2/${SesameAPI.deviceId}/history`,
      {
        headers: {
          'x-api-key': SesameAPI.apiKey,
        },
        params: {
          page: page,
          lg: length,
        },
      },
    );
    return res.data;
  }

  static async control(
    command: ActionCommand,
    author = 'bot',
    source = 'unknown',
  ): Promise<void> {
    const base64_history = Buffer.from(`${author}(${source})`).toString(
      'base64',
    );
    const sign = generateRandomTag(SesameAPI.secretKey);

    const res = await axios({
      method: 'post',
      url: `https://app.candyhouse.co/api/sesame2/${SesameAPI.deviceId}/cmd`,
      headers: { 'x-api-key': SesameAPI.apiKey },
      data: {
        cmd: command,
        history: base64_history,
        sign: sign,
      },
    });

    // const res = await axios.post(
    //   `https://app.candyhouse.co/api/sesame2/${SesameAPI.deviceId}/cmd`,
    //   {
    //     headers: {
    //       'x-api-key': SesameAPI.apiKey,
    //     },
    //     data: {
    //       cmd: command,
    //       history: base64_history,
    //       sign: sign,
    //     },
    //   },
    // );

    console.log(res);

    return;
  }
}
