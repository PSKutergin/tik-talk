import { Component, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AvatarCircleComponent } from '@tt/common';
import { LastMessageResponse } from '../../../interfaces/chat.interface';

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
