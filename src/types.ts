
export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export enum AppState {
  UPLOAD,
  PARSING,
  CHATTING,
  ERROR,
}
