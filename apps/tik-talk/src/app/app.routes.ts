import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { canActivateAuth, LoginComponent } from '@tt/auth';
import {
  ProfileComponent,
  SettingsComponent,
  SearchComponent,
  profileFeature,
  ProfileEffects
} from '@tt/profile';
import { chatsRoutes } from '@tt/chats';
import { LayoutComponent } from '@tt/layout';
import { postsFeature, PostEffects } from '@tt/posts';


export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
      {
        path: 'profile/:id',
        component: ProfileComponent,
        providers: [
          provideState(postsFeature),
          provideEffects(PostEffects)
        ]
      },
      { path: 'settings', component: SettingsComponent },
      { path: 'chats', loadChildren: () => chatsRoutes },
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
