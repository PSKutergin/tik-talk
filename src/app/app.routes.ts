import { Routes } from '@angular/router';
import { SearchComponent } from '@/app/pages/search/search.component';
import { LoginComponent } from '@/app/pages/login/login.component';
import { ProfileComponent } from '@/app/pages/profile/profile.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { canActivateAuth } from './core/auth/auth.guard';

export const routes: Routes = [
    {
        path: '', component: LayoutComponent, children:
            [
                { path: '', component: SearchComponent },
                { path: 'profile', component: ProfileComponent },
            ],
        canActivate: [canActivateAuth]
    },
    { path: 'login', component: LoginComponent }
];
