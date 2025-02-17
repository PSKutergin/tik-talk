import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  chatActions,
  selectAuthorFilter,
  selectFilteredChats,
  ResizeService
} from '@tt/data-access';
import { ChatsBtnComponent } from '../chats-btn/chats-btn.component';

@Component({
  selector: 'app-chats-list',
  standalone: true,
  imports: [
    ChatsBtnComponent,
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule
  ],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsListComponent implements AfterViewInit, OnDestroy, OnInit {
  private store = inject(Store);
  private resizeService = inject(ResizeService);
  private resizeSubscription: Subscription = Subscription.EMPTY;

  hostElement = inject(ElementRef);
  filterFormControl = new FormControl('');

  // Получаем отфильтрованные чаты из стора
  chats = this.store.selectSignal(selectFilteredChats);

  // Получаем текущий фильтр из стора через selectSignal
  authorFilter = this.store.selectSignal(selectAuthorFilter);

  constructor() {
    // Подписываемся на изменения в поле ввода и фильтруем чаты
    this.filterFormControl.valueChanges
      .pipe(debounceTime(500), takeUntilDestroyed())
      .subscribe((author) => {
        // Отправляем экшн для фильтрации чатов по автору
        this.store.dispatch(
          chatActions.filterLastChats({ author: author ?? '' })
        );
      });
  }

  ngOnInit(): void {
    // Запрашиваем последние чаты при инициализации
    this.store.dispatch(chatActions.fetchLastChats({}));

    // Устанавливаем значение фильтра в форму
    const authorFilter = this.authorFilter();
    this.filterFormControl.setValue(authorFilter);
  }

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
