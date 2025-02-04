import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DateTime } from 'luxon';
import { environment } from '@tt/shared';
import { ProfileService } from '@tt/profile';
import {
  Chat,
  LastMessageResponse,
  Message
} from '../interfaces/chat.interface';
import { Profile } from '@tt/interfaces/profile';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);

  chatsUrl = `${environment.api}chat/`;
  messagesUrl = `${environment.api}message/`;
  me: WritableSignal<Profile | null> = inject(ProfileService).me;
  activeChatMessages = signal<{ date: string; messages: Message[] }[]>([]);

  getMyChats(): Observable<LastMessageResponse[]> {
    return this.http.get<LastMessageResponse[]>(
      `${this.chatsUrl}get_my_chats/`
    );
  }

  getChatById(id: number): Observable<Chat> {
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

        this.groupMessagesByDate(patchedMessages);

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

  groupMessagesByDate(messages: Message[]) {
    const groupedMessages: { date: string; messages: Message[] }[] = [];
    const today = DateTime.local().startOf('day').toFormat('dd.MM.yyyy');
    const yesterday = DateTime.local()
      .minus({ days: 1 })
      .startOf('day')
      .toFormat('dd.MM.yyyy');

    messages.forEach((message) => {
      let date = DateTime.fromISO(message.createdAt, { zone: 'utc' })
        .setZone(DateTime.local().zone)
        .startOf('day')
        .toFormat('dd.MM.yyyy');

      message.createdAt = DateTime.fromISO(message.createdAt, { zone: 'utc' })
        .setZone(DateTime.local().zone)
        .toFormat('HH:mm');

      // Проверяем, если это сегодня или вчера, заменяем дату
      if (date === today) {
        date = 'Сегодня';
      } else if (date === yesterday) {
        date = 'Вчера';
      }

      // Ищем, существует ли уже группа для этой даты
      let group = groupedMessages.find((group) => group.date === date);

      if (!group) {
        // Если группы с такой датой нет, создаем новую
        group = { date, messages: [] };
        groupedMessages.push(group);
      }

      // Добавляем сообщение в группу
      group.messages.push(message);
    });

    this.activeChatMessages.set(groupedMessages);
  }
}
