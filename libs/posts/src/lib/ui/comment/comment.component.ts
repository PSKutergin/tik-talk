import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AvatarCircleComponent, TimeFormatPipe } from '@tt/common';
import { Comment } from '@tt/data-access';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [AvatarCircleComponent, TimeFormatPipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent {
  comment = input<Comment>();
}
