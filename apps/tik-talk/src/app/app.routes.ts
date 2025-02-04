import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
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
import { provideEffects } from '@ngrx/effects';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
      { path: 'profile/:id', component: ProfileComponent },
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
