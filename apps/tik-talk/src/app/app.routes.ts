import { Routes } from '@angular/router';
import { canActivateAuth } from '@tt/auth';
import { SearchComponent } from './pages/search/search.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { chatsRoutes } from './pages/chats/chatsRoutes';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
      { path: 'profile/:id', component: ProfileComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'chats', loadChildren: () => chatsRoutes },
      { path: 'search', component: SearchComponent }
    ],
    canActivate: [canActivateAuth]
  },
  { path: 'login', component: LoginComponent }
];
