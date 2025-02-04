import { Component, inject, WritableSignal, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ProfileService } from '@tt/profile';
import { SvgIconComponent, AvatarCircleComponent } from '@tt/common';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';
import { Profile } from '@tt/interfaces/profile';

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
  subscribers$ = this.profileService.getSubscribersShortList();
  me: WritableSignal<Profile | null> = this.profileService.me;

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

  ngOnInit() {
    firstValueFrom(this.profileService.getMe());
  }
}
