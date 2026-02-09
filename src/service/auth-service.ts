import { hash } from "bcrypt";

const hashPassword = async (password: string) => {
  return await hash(password, 8);
};
export {hashPassword}