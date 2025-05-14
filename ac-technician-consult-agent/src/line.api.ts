import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { LineMessage } from './common';

const LINE_API_CONFIG = {
  baseURL: 'https://api.line.me/v2/bot',
  headers: {
    'Content-Type': 'application/json',
  },
};

const lineClient: AxiosInstance = axios.create(LINE_API_CONFIG);

export const constructAccessToken = (channelAccessToken: string): string => {
  return `Bearer ${channelAccessToken}`;
};

export const reply = async (accessToken: string, replyToken: string, payload: LineMessage[]): Promise<AxiosResponse> => {
  try {
    const body = { replyToken, messages: payload };
    const response = await lineClient.post('/message/reply', body, {
      headers: {
        Authorization: accessToken,
      },
    });
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`LINE API error: ${error.message}`);
    }
    throw error;
  }
};
