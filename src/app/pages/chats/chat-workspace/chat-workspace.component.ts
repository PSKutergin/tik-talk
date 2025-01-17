import { Component } from '@angular/core';
import { ChatWorkspaceHeaderComponent } from './chat-workspace-header/chat-workspace-header.component';
import { ChatWorkspaceMessageWrapperComponent } from './chat-workspace-message-wrapper/chat-workspace-message-wrapper.component';
import { ChatService } from '@/app/shared/services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

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
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService
  ) {}

  activeChat$ = this.activatedRoute.params.pipe(
    switchMap(({ id }) => this.chatService.getChatById(Number(id)))
  );
}
