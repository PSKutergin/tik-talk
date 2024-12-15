import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "@/app/shared/components/sidebar/sidebar.component";
import { ProfileService } from '../../services/profile.service';
import { Profile } from '@/app/interfaces/profile.interface';

@Component({
  selector: 'layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.profileService.getMe()
      .subscribe((data: Profile) => {
        console.log(data);
      });
  }
}
