import { Component } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ProfileHeaderComponent } from "@/app/shared/components/profile-header/profile-header.component";
import { ProfileService } from '@/app/shared/services/profile.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SvgIconComponent } from '@/app/shared/components/svg-icon/svg-icon.component';
import { ImgUrlPipe } from "../../shared/pipes/img-url.pipe";
import { PostFeedComponent } from "./post-feed/post-feed.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SvgIconComponent, AsyncPipe, ProfileHeaderComponent, RouterLink, ImgUrlPipe, PostFeedComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  constructor(
    private profileService: ProfileService,
    private activatedRoute: ActivatedRoute
  ) { }

  subscribers$ = this.profileService.getSubscribersShortList(5);
  me$ = toObservable(this.profileService.me)

  profile$ = this.activatedRoute.params
    .pipe(
      switchMap(({ id }) => {
        if (id === 'me') return this.me$

        return this.profileService.getAccount(id)
      })
    )

}
