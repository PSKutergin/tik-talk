import { Component, WritableSignal } from '@angular/core';
import { SvgIconComponent } from '@/app/shared/components/svg-icon/svg-icon.component';
import { SubscriberCardComponent } from "./subscriber-card/subscriber-card.component";
import { RouterLink } from '@angular/router';
import { ProfileService } from '@/app/shared/services/profile.service';
import { AsyncPipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { Profile } from '@/app/interfaces/profile.interface';
import { ImgUrlPipe } from "@/app/shared/pipes/img-url.pipe";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SvgIconComponent, SubscriberCardComponent, RouterLink, AsyncPipe, ImgUrlPipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  subscribers$ = this.profileService.getSubscribersShortList();
  me: WritableSignal<Profile | null> = this.profileService.me;

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: ''
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

  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    firstValueFrom(this.profileService.getMe())
  }
}
