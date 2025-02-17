import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  InputSignal,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Chat, ChatService, ResizeService } from '@tt/data-access';
import { ChatWorkspaceMessageComponent } from './chat-workspace-message/chat-workspace-message.component';
import { MessageInputComponent } from '../../../ui';

@Component({
  selector: 'app-chat-workspace-message-wrapper',
  standalone: true,
  imports: [ChatWorkspaceMessageComponent, MessageInputComponent],
  templateUrl: './chat-workspace-message-wrapper.component.html',
  styleUrl: './chat-workspace-message-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatWorkspaceMessageWrapperComponent
  implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  private store = inject(Store);
  private resizeService = inject(ResizeService);
  private chatService = inject(ChatService);

  hostElement = inject(ElementRef);
  chat: InputSignal<Chat> = input.required<Chat>();
  private resizeSubscription: Subscription = Subscription.EMPTY;

  @ViewChild('messageWrapper') messageWrapper!: ElementRef;

  messagesGroups = this.chatService.activeChatMessages;

  ngOnInit(): void {
    this.scrollMessages();
  }

  ngAfterViewInit(): void {
    this.resizeService.resizeElement(this.hostElement);
    this.resizeSubscription = this.resizeService.onResize(100).subscribe(() => {
      this.resizeService.resizeElement(this.hostElement);
    });
  }

  ngAfterViewChecked() {
    this.scrollMessages();
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  scrollMessages() {
    if (this.messageWrapper) {
      this.messageWrapper.nativeElement.scrollTop =
        this.messageWrapper.nativeElement.scrollHeight;
    }
  }

  onMessageCreated(messageText: string) {
    this.chatService.wsAdapter.sendMessage(this.chat().id, messageText);
    this.scrollMessages();
  }
}
