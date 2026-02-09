import { compare } from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { userViewModel } from "../../view-model/user-view-model";
import { findUser } from "../service/user-service";

export class authController {
  async authenticate(req: Request, res: Response) {
    const { email, password } = req.body;

    const userReq = await findUser({ email });
    if (!userReq || !userReq.success) return res.status(400).json({ error: "Error finding User" });

    const isValuePassword = await compare(password, userReq.data.password);
    if (!isValuePassword) return res.status(401).json({ error: "Password invalid" });

    const token = jwt.sign({ id: userReq.data.id }, process.env.SECRETKEY as string, { expiresIn: "1d" });

    return res.json({ user: userViewModel(userReq.data), token });
  }
}
