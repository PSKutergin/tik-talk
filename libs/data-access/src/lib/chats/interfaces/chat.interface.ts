import { Profile } from '../../profile';

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
  createdAtTime?: string;
}

export interface LastMessageResponse {
  id: number;
  userFrom: Profile;
  message: string | null;
  createdAt: string;
  unreadMessages: number;
}
