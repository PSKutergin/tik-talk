import { Routes } from '@angular/router';
import { SearchComponent } from '@/app/pages/search/search.component';
import { LoginComponent } from '@/app/pages/login/login.component';
import { ProfileComponent } from '@/app/pages/profile/profile.component';
import { SettingsComponent } from '@/app/pages/settings/settings.component';
import { LayoutComponent } from '@/app/shared/components/layout/layout.component';
import { canActivateAuth } from '@/app/core/auth/auth.guard';

export const routes: Routes = [
    {
        path: '', component: LayoutComponent, children:
            [
                { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
                { path: 'profile/:id', component: ProfileComponent },
                { path: 'settings', component: SettingsComponent },
                { path: 'search', component: SearchComponent },
                { path: '**', redirectTo: '' }
            ],
        canActivate: [canActivateAuth]
    },
    { path: 'login', component: LoginComponent }
];
