import { createFeature, createReducer, on } from '@ngrx/store';
import { chatActions } from './actions';
import { Chat, LastMessageResponse } from '..';

export interface ChatState {
  authorFilter: string;
  lastChats: LastMessageResponse[];
  activeChat: Chat | null;
}

const initialState: ChatState = {
  authorFilter: '',
  lastChats: [],
  activeChat: null
};

export const chatsFeature = createFeature({
  name: 'chatsFeature',
  reducer: createReducer(
    initialState,
    on(chatActions.lastChatsLoaded, (state, payload) => {
      return {
        ...state,
        lastChats: payload.chats
      };
    }),
    on(chatActions.activeChatLoaded, (state, payload) => {
      const lastChatsStore = state.lastChats.map((chat) => {
        if (chat.id === payload.chat.id) {
          return {
            ...chat,
            unreadMessages: 0
          };
        }
        return chat;
      });

      return {
        ...state,
        lastChats: lastChatsStore,
        activeChat: payload.chat
      };
    }),
    on(chatActions.filterLastChats, (state, { author }) => {
      return {
        ...state,
        authorFilter: author
      };
    })
  )
});
