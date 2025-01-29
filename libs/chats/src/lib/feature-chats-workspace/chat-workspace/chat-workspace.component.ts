import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, of, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ChatService } from '../../data';
import { ChatWorkspaceHeaderComponent } from './chat-workspace-header/chat-workspace-header.component';
import { ChatWorkspaceMessageWrapperComponent } from './chat-workspace-message-wrapper/chat-workspace-message-wrapper.component';


@Component({
  selector: 'app-chat-workspace',
  standalone: true,
  imports: [
    ChatWorkspaceHeaderComponent,
    ChatWorkspaceMessageWrapperComponent,
    AsyncPipe
  ],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss'
})
export class ChatWorkspaceComponent {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService
  ) { }

  activeChat$ = this.activatedRoute.params.pipe(
    switchMap(({ id }) => {
      if (id === 'new') {
        return this.activatedRoute.queryParams.pipe(
          filter(({ userId }) => userId),
          switchMap(({ userId }) => {
            return this.chatService.createdChat(userId).pipe(
              switchMap((res) => {
                this.router.navigate(['/chats', res.id])
                return of(null);
              })
            )
          })
        )
      }
      return this.chatService.getChatById(Number(id));
    })
  );
}
