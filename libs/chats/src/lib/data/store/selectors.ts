import { createSelector } from '@ngrx/store';
import { chatsFeature } from './reducer';

export const selectLastChats = createSelector(
  chatsFeature.selectLastChats,
  (chats) => chats
);

export const selectActiveChat = createSelector(
  chatsFeature.selectActiveChat,
  (chat) => chat
);

export const selectAuthorFilter = createSelector(
  chatsFeature.selectAuthorFilter,
  (author) => author
);

export const selectFilteredChats = createSelector(
  selectLastChats,
  selectAuthorFilter,
  (chats, author) => {
    if (!author) {
      return chats; // Если фильтр пуст, возвращаем все чаты
    }
    return chats.filter((chat) =>
      `${chat.userFrom.firstName} ${chat.userFrom.lastName}`
        .toLowerCase()
        .includes(author.toLowerCase())
    );
  }
);