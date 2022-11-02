import * as dotenv from 'dotenv';

import { IUser } from 'src/modules/user/interfaces/user.interface';

dotenv.config();

export const users: IUser[] = [
  {
    id: 1,
    firstName: 'Admin',
    lastName: process.env.ADMIN_LASTNAME,
    isAdmin: true,
    password: process.env.ADMIN_PASSWORD,
    email: process.env.ADMIN_EMAIL,
  },
];
