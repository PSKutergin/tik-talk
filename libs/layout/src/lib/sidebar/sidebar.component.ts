import { Component, inject, WritableSignal, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChatService, ProfileService, Profile } from '@tt/data-access';
import { SvgIconComponent, AvatarCircleComponent } from '@tt/common';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SvgIconComponent,
    SubscriberCardComponent,
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    AvatarCircleComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  private profileService = inject(ProfileService);
  private chatService = inject(ChatService);

  subscribers$ = this.profileService.getSubscribersShortList();
  me: WritableSignal<Profile | null> = this.profileService.me;
  unreadMessages = this.chatService.unreadMessages;

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: 'profile/me'
    },
    {
      label: 'Чаты',
      icon: 'chats',
      link: 'chats'
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search'
    }
  ];

  constructor() {
    this.chatService.connectWs().pipe(takeUntilDestroyed()).subscribe();
  }

  ngOnInit() {
    firstValueFrom(this.profileService.getMe());
  }
}
