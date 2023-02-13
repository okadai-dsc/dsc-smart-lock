import { Status } from 'Sesame';
import axios, { AxiosError } from 'axios';

export class SesameAPI {
  private static apiKey: string;
  private static deviceId: string;
  private static secretKey: string;

  static initialize(apiKey: string, deviceId: string, secretKey: string) {
    SesameAPI.apiKey = apiKey;
    SesameAPI.deviceId = deviceId;
    SesameAPI.secretKey = secretKey;
  }

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
}
