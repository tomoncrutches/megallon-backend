import { compare } from 'bcrypt';
export const isEmpty = (data: object) => {
  return Object.entries(data).length === 0;
};

type Props = {
  password: string;
  storedPassword: string;
};
export const verifyPassword = async ({ password, storedPassword }: Props) => {
  return await compare(password, storedPassword);
};
