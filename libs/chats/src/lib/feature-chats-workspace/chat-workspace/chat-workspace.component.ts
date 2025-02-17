import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { chatActions, selectActiveChat } from '@tt/data-access';
import { ChatWorkspaceHeaderComponent } from './chat-workspace-header/chat-workspace-header.component';
import { ChatWorkspaceMessageWrapperComponent } from './chat-workspace-message-wrapper/chat-workspace-message-wrapper.component';

@Component({
  selector: 'app-chat-workspace',
  standalone: true,
  imports: [ChatWorkspaceHeaderComponent, ChatWorkspaceMessageWrapperComponent],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss'
})
export class ChatWorkspaceComponent {
  private store = inject(Store);
  private activatedRoute = inject(ActivatedRoute);

  activeChat = this.store.selectSignal(selectActiveChat);

  constructor() {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => {
          if (id === 'new') {
            return this.activatedRoute.queryParams.pipe(
              filter(({ userId }) => userId),
              switchMap(({ userId }) => {
                this.store.dispatch(chatActions.createChat({ userId }));
                return of(null);
              })
            );
          }

          this.store.dispatch(
            chatActions.fetchActiveChat({ chatId: Number(id) })
          );
          return of(null);
        })
      )
      .pipe(takeUntilDestroyed())
      .subscribe();
  }
}
