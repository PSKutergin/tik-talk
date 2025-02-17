import { finalize, Observable, switchMap, tap } from 'rxjs';
import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';
import { webSocket } from 'rxjs/webSocket';
import {
  ChatWsError,
  ChatWsMessage
} from '../interfaces/chat-ws-message.interface';
import {
  ChatConnectionWsParams,
  ChatWsService
} from '../interfaces/chat-ws-service.interface';
import { inject } from '@angular/core';
import { AuthService } from '@tt/auth';

export class ChatWsRxjsService implements ChatWsService {
  private authService = inject(AuthService);
  #socket: WebSocketSubject<ChatWsMessage> | null = null;

  connect(params: ChatConnectionWsParams): Observable<ChatWsMessage> {
    if (!this.#socket) {
      this.#socket = webSocket({
        url: params.url,
        protocol: [params.token]
      });
    }

    return this.#socket.asObservable().pipe(
      tap((message) => {
        if (
          (message as ChatWsError).status === 'error' &&
          (message as ChatWsError).message === 'Invalid token'
        ) {
          this.disconnect();
          this.handleInvalidToken(params);
        } else {
          params.handleMessage(message);
        }
      }),
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

  private handleInvalidToken(params: ChatConnectionWsParams): void {
    this.authService
      .refresh()
      .pipe(
        switchMap(() => {
          return this.connect({
            url: params.url,
            token: this.authService.token || '',
            handleMessage: params.handleMessage
          });
        })
      )
      .subscribe({
        next: (message) => {
          console.log('Reconnected with new token', message);
        },
        error: (err) => {
          console.error('Failed to refresh token or reconnect', err);
        }
      });
  }
}
