import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '@/environments/environment';
import { Chat, LastMessageResponse, Message } from '@/app/interfaces/chat.interface';
import { map, Observable } from 'rxjs';
import { Profile } from '@/app/interfaces/profile.interface';
import { ProfileService } from './profile.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  chatsUrl = `${environment.api}chat/`;
  messagesUrl = `${environment.api}message/`;
  me: WritableSignal<Profile | null> = inject(ProfileService).me
  activeChatMessages = signal<Message[]>([])

  constructor(private http: HttpClient) { }

  getMyChats(): Observable<LastMessageResponse[]> {
    return this.http.get<LastMessageResponse[]>(`${this.chatsUrl}get_my_chats/`);
  }

  getChatById(id: number): Observable<Chat> {
    return this.http.get<Chat>(`${this.chatsUrl}${id}`)
      .pipe(
        map((chat: Chat) => {
          const patchedMessages = chat.messages.map(message => ({
            ...message,
            user: chat.userFirst.id === message.userFromId ? chat.userFirst : chat.userSecond,
            isMine: message.userFromId === this.me()!.id
          }))
          this.activeChatMessages.set(patchedMessages)

          return {
            ...chat,
            companion: chat.userFirst.id === this.me()!.id ? chat.userSecond : chat.userFirst,
            messages: patchedMessages
          }
        })
      )
  }

  createdChat(userId: number): Observable<Chat> {
    return this.http.post<Chat>(`${this.chatsUrl}${userId}`, {});
  }

  sendMessage(chatId: number, message: string): Observable<Message> {
    return this.http.post<Message>(`${this.messagesUrl}send/${chatId}`, {}, { params: { message } });
  }

}
