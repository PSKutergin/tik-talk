import { createActionGroup, props } from '@ngrx/store';
import { Chat, LastMessageResponse } from '..';

export const chatActions = createActionGroup({
  source: 'chats',
  events: {
    'create chat': props<{ userId: number }>(),
    'filter last chats': props<{ author: string }>(),
    'fetch last chats': props<{ page?: number }>(),
    'last chats loaded': props<{ chats: LastMessageResponse[] }>(),
    'fetch active chat': props<{ chatId: number }>(),
    'active chat loaded': props<{ chat: Chat }>()
  }
});
