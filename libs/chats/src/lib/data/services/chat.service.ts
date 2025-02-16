import _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DateTime } from 'luxon';
import { environment } from '@tt/shared';
import { AuthService } from '@tt/auth';
import { ProfileService } from '@tt/profile';
import {
  Chat,
  LastMessageResponse,
  Message
} from '../interfaces/chat.interface';
import { Profile } from '@tt/interfaces/profile';
import { ChatWsService } from '../interfaces/chat-ws-service.interface';
import { ChatWsMessage } from '../interfaces/chat-ws-message.interface';
import { isNewMessage, isUnreadMessage } from '../interfaces/types-guard';
import { ChatWsRxjsService } from './chat-ws-rxjs.service';
import { Store } from '@ngrx/store';
import { chatActions } from '..';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private store = inject(Store);
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  chatsUrl = `${environment.api}chat/`;
  messagesUrl = `${environment.api}message/`;
  me: WritableSignal<Profile | null> = inject(ProfileService).me;
  unreadMessages = signal<number>(0);
  activeChatId = signal<number>(0);
  activeChatMessages = signal<{ date: string; messages: Message[] }[]>([]);

  wsAdapter: ChatWsService = new ChatWsRxjsService();

  connectWs(): Observable<ChatWsMessage> {
    return this.wsAdapter.connect({
      url: `${this.chatsUrl}ws`,
      token: this.authService.token ?? '',
      handleMessage: this.handleWSMessage
    }) as Observable<ChatWsMessage>;
  }

  handleWSMessage = (message: ChatWsMessage): void => {
    if (!('action' in message)) return;

    if (isNewMessage(message)) {
      if (this.activeChatId() === message.data.chat_id) {
        this.activeChatMessages.update((mgs) => {
          const newMessage = {
            id: message.data.id,
            userFromId: message.data.author,
            personalChatId: message.data.chat_id,
            text: message.data.message,
            createdAt: message.data.created_at,
            isRead: false,
            isMine: false
          };
          const oldMessages = mgs.flatMap((d) => d.messages);
          const newMessages = [...oldMessages, newMessage];

          return this.groupMessagesByDate(newMessages as Message[]);
        });
      } else {
        this.store.dispatch(chatActions.fetchLastChats({}));
      }
    }

    if (isUnreadMessage(message)) this.unreadMessages.set(message.data.count);
  };

  getMyChats(): Observable<LastMessageResponse[]> {
    return this.http.get<LastMessageResponse[]>(
      `${this.chatsUrl}get_my_chats/`
    );
  }

  getChatById(id: number): Observable<Chat> {
    this.activeChatId.set(id);

    return this.http.get<Chat>(`${this.chatsUrl}${id}`).pipe(
      map((chat: Chat) => {
        const patchedMessages = chat.messages.map((message) => ({
          ...message,
          user:
            chat.userFirst.id === message.userFromId
              ? chat.userFirst
              : chat.userSecond,
          isMine: message.userFromId === this.me()!.id
        }));

        this.activeChatMessages.set(this.groupMessagesByDate(patchedMessages));

        return {
          ...chat,
          companion:
            chat.userFirst.id === this.me()!.id
              ? chat.userSecond
              : chat.userFirst,
          messages: patchedMessages
        };
      })
    );
  }

  createdChat(userId: number): Observable<Chat> {
    return this.http.post<Chat>(`${this.chatsUrl}${userId}`, {});
  }

  sendMessage(chatId: number, message: string): Observable<Message> {
    return this.http.post<Message>(
      `${this.messagesUrl}send/${chatId}`,
      {},
      { params: { message } }
    );
  }

  groupMessagesByDate(
    messages: Message[]
  ): { date: string; messages: Message[] }[] {
    const today = DateTime.local().startOf('day').toFormat('dd.MM.yyyy');
    const yesterday = DateTime.local()
      .minus({ days: 1 })
      .startOf('day')
      .toFormat('dd.MM.yyyy');

    // Преобразуем createdAt для каждого сообщения
    const formattedMessages = messages.map((message) => ({
      ...message,
      createdAt: DateTime.fromISO(message.createdAt, { zone: 'utc' })
        .setZone(DateTime.local().zone)
        .toFormat('HH:mm')
    }));

    // Группируем сообщения по дате
    const groupedMessages = _.groupBy(formattedMessages, (message) => {
      const messageDate = DateTime.fromISO(message.createdAt)
        .startOf('day')
        .toFormat('dd.MM.yyyy');

      // Сравниваем дату сообщения с today и yesterday
      if (messageDate === today) {
        return 'Сегодня';
      } else if (messageDate === yesterday) {
        return 'Вчера';
      } else {
        return messageDate;
      }
    });

    return Object.entries(groupedMessages).map(([date, messages]) => ({
      date,
      messages
    }));
  }
}
