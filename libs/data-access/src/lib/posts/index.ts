import {
  Post,
  Comment,
  PostCreateDto,
  CommentCreateDto
} from './interfaces/post.interface';
import { PostService } from './services/post.service';

export { Post, PostCreateDto, Comment, CommentCreateDto, PostService };
export * from './store';
