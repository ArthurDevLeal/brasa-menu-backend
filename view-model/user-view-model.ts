import { UserModel } from "../generated/prisma/models";

export const userViewModel = (user: UserModel) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};
