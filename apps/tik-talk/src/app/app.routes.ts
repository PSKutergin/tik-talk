import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { LoginComponent } from '@tt/auth';
import {
  ProfileComponent,
  SettingsComponent,
  SearchComponent
} from '@tt/profile';
import {
  canActivateAuth,
  ChatEffects,
  chatsFeature,
  profileFeature,
  ProfileEffects,
  postsFeature,
  PostEffects
} from '@tt/data-access';
import { LayoutComponent } from '@tt/layout';
import { chatsRoutes } from '@tt/chats';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
      {
        path: 'profile/:id',
        component: ProfileComponent,
        providers: [provideState(postsFeature), provideEffects(PostEffects)]
      },
      { path: 'settings', component: SettingsComponent },
      {
        path: 'chats',
        loadChildren: () => chatsRoutes,
        providers: [provideState(chatsFeature), provideEffects(ChatEffects)]
      },
      {
        path: 'search',
        component: SearchComponent,
        providers: [
          provideState(profileFeature),
          provideEffects(ProfileEffects)
        ]
      }
    ],
    canActivate: [canActivateAuth]
  },
  { path: 'login', component: LoginComponent }
];
