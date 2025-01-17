import { Component, inject, input } from '@angular/core';
import { AvatarCircleComponent } from '@/app/shared/components/avatar-circle/avatar-circle.component';
import { LastMessageResponse } from '@/app/interfaces/chat.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'button[chats]',
  standalone: true,
  imports: [AvatarCircleComponent],
  providers: [DatePipe],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss'
})
export class ChatsBtnComponent {
  chat = input<LastMessageResponse>();
  datePipe: DatePipe = inject(DatePipe);

  getFormattedDate(date: string): string | null {
    const currentDate = new Date();
    const chatDate = new Date(date);

    if (currentDate.getDate() > chatDate.getDate()) {
      return this.datePipe.transform(chatDate, 'dd.MM.yy');
    } else {
      return this.datePipe.transform(chatDate, 'HH:mm');
    }
  }
}
