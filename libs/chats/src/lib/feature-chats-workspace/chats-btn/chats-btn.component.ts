import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { AvatarCircleComponent } from '@tt/common';
import { LastMessageResponse } from '@tt/data-access';

@Component({
  selector: 'button[chats]',
  standalone: true,
  imports: [AvatarCircleComponent],
  providers: [DatePipe],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsBtnComponent {
  chat = input<LastMessageResponse>();
  datePipe: DatePipe = inject(DatePipe);

  getFormattedDate(date: string): string | null {
    if (!date) return null;

    const currentDate = new Date().setHours(0, 0, 0, 0);
    const chatDate = new Date(date).setHours(0, 0, 0, 0);

    if (currentDate > chatDate) {
      return this.datePipe.transform(chatDate, 'dd.MM.yy');
    } else {
      return this.datePipe.transform(new Date(date), 'HH:mm');
    }
  }
}
