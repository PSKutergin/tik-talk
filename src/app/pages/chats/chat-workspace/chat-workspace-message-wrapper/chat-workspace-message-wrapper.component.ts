import { AfterViewChecked, AfterViewInit, Component, DestroyRef, ElementRef, inject, input, InputSignal, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ChatWorkspaceMessageComponent } from "./chat-workspace-message/chat-workspace-message.component";
import { MessageInputComponent } from "@/app/shared/components/message-input/message-input.component";
import { Chat } from '@/app/interfaces/chat.interface';
import { ChatService } from '@/app/shared/services/chat.service';
import { debounceTime, firstValueFrom, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chat-workspace-message-wrapper',
  standalone: true,
  imports: [ChatWorkspaceMessageComponent, MessageInputComponent],
  templateUrl: './chat-workspace-message-wrapper.component.html',
  styleUrl: './chat-workspace-message-wrapper.component.scss'
})
export class ChatWorkspaceMessageWrapperComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  r2 = inject(Renderer2)
  hostElement = inject(ElementRef)
  destroy$ = inject(DestroyRef);
  chat: InputSignal<Chat> = input.required<Chat>()

  @ViewChild('messageWrapper') messageWrapper!: ElementRef

  constructor(private chatService: ChatService) { }

  messages = this.chatService.activeChatMessages

  ngOnInit(): void {
    this.scrollMessages()
  }

  ngAfterViewInit(): void {
    this.resizeFeed()

    fromEvent(window, 'resize')
      .pipe(
        debounceTime(100),
        takeUntilDestroyed(this.destroy$)
      )
      .subscribe(() => {
        this.resizeFeed()
      })
  }

  ngAfterViewChecked() {
    this.scrollMessages();
  }

  ngOnDestroy(): void { }

  resizeFeed(): void {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect()
    const height = window.innerHeight - top - 24

    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`)
  }

  scrollMessages() {
    if (this.messageWrapper) {
      this.messageWrapper.nativeElement.scrollTop = this.messageWrapper.nativeElement.scrollHeight;
    }
  }

  async onMessageCreated(messageText: string) {
    await firstValueFrom(this.chatService.sendMessage(this.chat().id, messageText))

    await firstValueFrom(this.chatService.getChatById(this.chat().id))

    this.scrollMessages()
  }
}
