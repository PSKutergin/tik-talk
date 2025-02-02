import { Component } from '@angular/core';
import { ChatsBtnComponent } from '../chats-btn/chats-btn.component';
import { ChatService } from '@/app/shared/services/chat.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-chats-list',
  standalone: true,
  imports: [
    ChatsBtnComponent,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule
  ],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss'
})
export class ChatsListComponent {
  filterFormControl = new FormControl('');

  constructor(private chatService: ChatService) {}

  chats$ = this.chatService.getMyChats().pipe(
    switchMap((chats) => {
      return this.filterFormControl.valueChanges.pipe(
        startWith(''),
        map((value) =>
          value
            ? chats.filter((chat) =>
                `${chat.userFrom.firstName} ${chat.userFrom.lastName}`
                  .toLowerCase()
                  .includes(value.toLowerCase() || '')
              )
            : chats
        )
      );
    })
  );
}
