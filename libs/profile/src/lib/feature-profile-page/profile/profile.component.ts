import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PostFeedComponent } from '@tt/posts';
import { SvgIconComponent, AvatarCircleComponent } from '@tt/common';
import { ProfileService } from '@tt/data-access';
import { ProfileHeaderComponent } from '../../ui';

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
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private profileService = inject(ProfileService);

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
    this.router.navigate(['/chats', 'new'], { queryParams: { userId } });
  }
}
