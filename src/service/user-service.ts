import { UserCreateInput, UserUpdateInput } from "../../generated/prisma/models";
import { prisma } from "../lib/prisma";

const createUser = async (data: UserCreateInput) => {
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
    },
  });
  if (user) return { success: true, data: user };
  return console.error("Error Creating new user");
};

const findUser = async ({ email, id }: { email?: string; id?: string }) => {
  const user = await prisma.user.findFirst({
    where: { OR: [{ email }, { id }] },
  });
  if (user) return { success: true, data: user };
  return console.error("Error finding the user");
};

const updateUser = async ({ id, data }: { id: string; data: UserUpdateInput }) => {
  const user = await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
    },
  });
  if (user) return { success: true, data: user };
  return console.error("Error updating the user");
};

const deleteUser = async (id: string) => {
  const user = await prisma.user.delete({
    where: { id },
  });
  if (user) return { success: true, data: user };
  return console.error("Error deleting the user");
};

export { createUser, deleteUser, findUser, updateUser };
