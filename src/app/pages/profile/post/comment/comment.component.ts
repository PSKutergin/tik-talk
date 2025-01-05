import { Comment } from '@/app/interfaces/post.interface';
import { Component, input } from '@angular/core';
import { AvatarCircleComponent } from "@/app/shared/components/avatar-circle/avatar-circle.component";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [AvatarCircleComponent, DatePipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  comment = input<Comment>()
}
