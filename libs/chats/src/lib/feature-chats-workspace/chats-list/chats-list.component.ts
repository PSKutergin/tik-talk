import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map, startWith, Subscription, switchMap } from 'rxjs';
import { ChatService } from '../../data';
import { ChatsBtnComponent } from '../chats-btn/chats-btn.component';
import { ResizeService } from '@tt/shared';

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
export class ChatsListComponent implements AfterViewInit, OnDestroy {
  private resizeService = inject(ResizeService);
  private chatService = inject(ChatService);
  private resizeSubscription: Subscription = Subscription.EMPTY;

  hostElement = inject(ElementRef);
  filterFormControl = new FormControl('');

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

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.resizeService.resizeElement(this.hostElement);
    }, 0);

    this.resizeSubscription = this.resizeService.onResize(100).subscribe(() => {
      this.resizeService.resizeElement(this.hostElement);
    });
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }
}
