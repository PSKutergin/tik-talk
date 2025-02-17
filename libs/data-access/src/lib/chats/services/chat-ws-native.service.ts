import {
  ChatConnectionWsParams,
  ChatWsService
} from '../interfaces/chat-ws-service.interface';

export class ChatWsNativeService implements ChatWsService {
  #socket: WebSocket | null = null;

  connect(params: ChatConnectionWsParams): void {
    if (this.#socket) return;

    this.#socket = new WebSocket(params.url, [params.token]);

    this.#socket.onmessage = (event: MessageEvent) => {
      params.handleMessage(JSON.parse(event.data));
    };

    this.#socket.onclose = () => {
      this.#socket = null;
      console.log('Connection websocket was closed');
    };
  }

  sendMessage(chatId: number, text: string): void {
    this.#socket?.send(
      JSON.stringify({
        chat_id: chatId,
        text
      })
    );
  }

  disconnect(): void {
    this.#socket?.close();
  }
}
