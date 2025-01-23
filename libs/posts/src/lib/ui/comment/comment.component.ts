import { Component, input } from '@angular/core';
import { AvatarCircleComponent, TimeFormatPipe } from '@tt/common';
import { Comment } from '../../data';

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
