import { Component, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PostFeedComponent } from './post-feed/post-feed.component';
import { SvgIconComponent } from '../../shared/components/svg-icon/svg-icon.component';
import { AvatarCircleComponent } from '../../shared/components/avatar-circle/avatar-circle.component';
import { ChatService } from '../../shared/services/chat.service';
import { ProfileHeaderComponent } from '../../shared/components/profile-header/profile-header.component';
import { ProfileService } from '../../shared/services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    SvgIconComponent,
    AsyncPipe,
    ProfileHeaderComponent,
    RouterLink,
    PostFeedComponent,
    AvatarCircleComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  constructor(
    private profileService: ProfileService,
    private chatService: ChatService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  subscribers$ = this.profileService.getSubscribersShortList(5);
  me$ = toObservable(this.profileService.me);

  isMyPage = signal<boolean>(false);

  profile$ = this.activatedRoute.params.pipe(
    switchMap(({ id }) => {
      this.isMyPage.set(id === 'me' || id === this.profileService.me()?.id);
      if (id === 'me') return this.me$;

      return this.profileService.getAccount(id);
    })
  );

  async onSendMessage(userId: number) {
    firstValueFrom(this.chatService.createdChat(userId)).then((res) =>
      this.router.navigate(['/chats', res.id])
    );
  }
}
