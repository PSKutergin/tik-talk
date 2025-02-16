import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, tap } from 'rxjs';
import { chatActions, ChatService } from '..';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ChatEffects {
  private router = inject(Router);
  chatService = inject(ChatService);
  actions$ = inject(Actions);

  createNewChat = createEffect(() =>
    this.actions$.pipe(
      ofType(chatActions.createChat),
      switchMap(({ userId }) =>
        this.chatService.createdChat(userId).pipe(
          tap((chat) => {
            this.router.navigate(['/chats', chat.id]);
          }),
          map((chat) => chatActions.activeChatLoaded({ chat }))
        )
      )
    )
  );

  loadLastMessages = createEffect(() =>
    this.actions$.pipe(
      ofType(chatActions.fetchLastChats),
      switchMap(() => this.chatService.getMyChats()),
      map((chats) => chatActions.lastChatsLoaded({ chats }))
    )
  );

  loadActiveChat = createEffect(() =>
    this.actions$.pipe(
      ofType(chatActions.fetchActiveChat),
      switchMap(({ chatId }) => this.chatService.getChatById(chatId)),
      map((chat) => chatActions.activeChatLoaded({ chat }))
    )
  );
}
