import { Request, Response } from "express";
import { userViewModel } from "../../view-model/user-view-model";
import { hashPassword } from "../service/auth-service";
import { createUser, deleteUser, findUser, updateUser } from "../service/user-service";

export class userController {
  async index(req: Request, res: Response) {
    const id = req.userId;
    const { email } = req.body;
    let userReq;
    if (!email) {
      userReq = await findUser({ id });
    } else {
      userReq = await findUser({ email });
    }
    if (!userReq || !userReq.success) return res.status(400).json({ error: "User not found" });
    return res.json({
      message: "User retrieved successfully",
      data: userViewModel(userReq.data),
    });
  }

  async store(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const userExists = await findUser({ email });
    if (userExists) return res.status(400).json({ error: "User Already exist" });

    const hash_password = await hashPassword(password);

    const userReq = await createUser({ email, password: hash_password, name });
    if (!userReq || !userReq.success) return res.status(400).json({ error: "Error creating User" });

    return res.json({
      message: "User created successfully",
      data: userViewModel(userReq.data),
    });
  }

  async update(req: Request, res: Response) {
    const id = req.userId;
    const { name, email, password, avatarUrl } = req.body;

    const userExists = await findUser({ id });
    if (!userExists || !userExists.success) return res.status(400).json({ error: "User not found" });

    const updateData: any = {};
    if (name) {
      updateData.name = name;
    }
    if (email) {
      if (email !== userExists.data.email) {
        const emailExists = await findUser({ email });
        if (emailExists && emailExists.success) {
          return res.status(409).json({
            error: "Email already in use by another user",
          });
        }
        updateData.email = email;
      }
    }
    if (password) {
      const hash_password = await hashPassword(password);
      updateData.password = hash_password;
    }
    if (avatarUrl) {
      updateData.avatarUrl = avatarUrl;
    }
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: "No valid fields to update",
      });
    }

    const userReq = await updateUser({ id, data: updateData });
    if (!userReq || !userReq.success) return res.status(500).json({ error: "Error updating user" });
    return res.json({
      message: "User updated successfully",
      data: userViewModel(userReq.data),
    });
  }

  async delete(req: Request, res: Response) {
    const id = req.userId;
    const userExists = await findUser({ id });
    if (!userExists || !userExists.success) return res.status(400).json({ error: "User not found" });

    const userReq = await deleteUser(id);
    if (!userReq || !userReq.success) return res.status(400).json({ error: "Error deleting User" });
    return res.json({
      message: "User deleted successfully",
      data: userViewModel(userReq.data),
    });
  }
}
