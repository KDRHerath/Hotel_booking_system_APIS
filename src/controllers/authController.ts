import { ERROR_RESPONSE, SUCCESS_RESPONSE } from "../lib/customHandler";
import { Request, Response } from "express";
import prisma from "../lib/db";
import { hashPassword } from "../lib/hashHelper";

export const userRegistaration = async (req: Request, res: Response) => {
  if (req.method !== "POST") {
    return ERROR_RESPONSE(res, false, 405, "Method Not Allowed");
  }
  const { email, password, userName } = req.body;
  try {
    const isUserEmail = await prisma.user.findUnique({
      where: { email: email },
    });

    if (isUserEmail) {
      return ERROR_RESPONSE(res, false, 409, "Email already exists!");
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, userName },
    });
    return SUCCESS_RESPONSE(res, true, 201, user, "User created successfully");
  } catch (error) {
    return ERROR_RESPONSE(res, false, 500, "Internal Server Error");
  }
};
