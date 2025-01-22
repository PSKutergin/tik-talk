import { SvgIconComponent } from '@/app/shared/components/svg-icon/svg-icon.component';
import { DndDirective } from '@/app/shared/directives/dnd.directive';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-avatar-upload',
  standalone: true,
  imports: [SvgIconComponent, DndDirective],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss'
})
export class AvatarUploadComponent {
  preview = signal<string>('/assets/images/avatar-placeholder.png');
  avatar: File | null = null;

  fileBrowserHandler(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];

    this.proccessFile(file);
  }

  onFileDropped(file: File) {
    this.proccessFile(file);
  }

  proccessFile(file: File | null | undefined) {
    if (!file || !file.type.match('image')) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      this.preview.set(event.target?.result?.toString() ?? '');
    };

    reader.readAsDataURL(file);

    this.avatar = file;
  }
}
