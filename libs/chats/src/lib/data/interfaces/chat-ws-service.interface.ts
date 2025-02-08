import { ChatWsMessage } from './chat-ws-message.interface';

export interface ChatConnectionWsParams {
  url: string;
  token: string;
  handleMessage: (event: ChatWsMessage) => void;
}

export interface ChatWsService {
  connect(params: ChatConnectionWsParams): void;
  disconnect(): void;
  sendMessage(chatId: number, text: string): void;
}
