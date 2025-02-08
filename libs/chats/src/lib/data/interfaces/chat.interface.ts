import { Profile } from '@tt/interfaces/profile';

export interface Chat {
  id: number;
  userFirst: Profile;
  userSecond: Profile;
  messages: Message[];
  companion?: Profile;
}

export interface Message {
  id: number;
  text: string;
  userFromId: number;
  personalChatId: number;
  createdAt: string;
  updatedAt?: string;
  isRead: boolean;
  user?: Profile;
  isMine?: boolean;
}

export interface LastMessageResponse {
  id: number;
  userFrom: Profile;
  message: string | null;
  createdAt: string;
  unreadMessages: number;
}
