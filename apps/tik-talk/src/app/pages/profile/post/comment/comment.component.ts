import { Component, input } from '@angular/core';
import { AvatarCircleComponent } from '../../../../shared/components/avatar-circle/avatar-circle.component';
import { TimeFormatPipe } from '../../../../shared/pipes/time-format.pipe';
import { Comment } from '../../../../interfaces/post.interface';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [AvatarCircleComponent, TimeFormatPipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  comment = input<Comment>();
}
