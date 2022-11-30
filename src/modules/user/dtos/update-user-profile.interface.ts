import { IUserSession } from '../interfaces/user-session.interface';

export interface IUpdateUserProfile {
  id: number;
  email: string;
  isAdmin: boolean;
  userSession: IUserSession;
}
