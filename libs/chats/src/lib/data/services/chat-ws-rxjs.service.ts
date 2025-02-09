import { finalize, Observable, tap } from 'rxjs';
import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';
import { webSocket } from 'rxjs/webSocket';
import { ChatWsMessage } from '../interfaces/chat-ws-message.interface';
import {
  ChatConnectionWsParams,
  ChatWsService
} from '../interfaces/chat-ws-service.interface';

export class ChatWsRxjsService implements ChatWsService {
  #socket: WebSocketSubject<ChatWsMessage> | null = null;

  connect(params: ChatConnectionWsParams): Observable<ChatWsMessage> {
    if (!this.#socket) {
      this.#socket = webSocket({
        url: params.url,
        protocol: [params.token]
      });
    }

    return this.#socket.asObservable().pipe(
      tap((message) => params.handleMessage(message)),
      finalize(() => {
        this.#socket = null;
        console.log('Connection websocket was closed');
      })
    );
  }

  disconnect(): void {
    this.#socket?.complete();
  }

  sendMessage(chatId: number, text: string): void {
    this.#socket?.next({
      chat_id: chatId,
      text
    });
  }
}
