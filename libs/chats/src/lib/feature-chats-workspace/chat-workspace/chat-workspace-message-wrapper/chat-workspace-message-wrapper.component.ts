import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  InputSignal,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { ChatWorkspaceMessageComponent } from './chat-workspace-message/chat-workspace-message.component';
import { MessageInputComponent } from '../../../ui';
import { Chat, ChatService } from '../../../data';
import { ResizeService } from '@tt/shared';

@Component({
  selector: 'app-chat-workspace-message-wrapper',
  standalone: true,
  imports: [ChatWorkspaceMessageComponent, MessageInputComponent],
  templateUrl: './chat-workspace-message-wrapper.component.html',
  styleUrl: './chat-workspace-message-wrapper.component.scss'
})
export class ChatWorkspaceMessageWrapperComponent
  implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked
{
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

  async onMessageCreated(messageText: string) {
    this.chatService.wsAdapter.sendMessage(this.chat().id, messageText);

    await firstValueFrom(this.chatService.getChatById(this.chat().id));

    this.scrollMessages();
  }
}
