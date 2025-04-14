import { ERROR_RESPONSE, SUCCESS_RESPONSE } from "../lib/customHandler";
import { Request, Response } from "express";
import prisma from "../lib/db";
import { hashPassword } from "../lib/argon2Hash";

export const userRegistaration = async (req: Request, res: Response) => {
  const { email, password, userName } = req.body;
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000); // e.g., "839274"
  };

  console.log("generateVerificationCode", generateVerificationCode());
  try {
    const isUserEmail = await prisma.user.count({
      where: { email: email },
    });

    if (isUserEmail > 0) {
      console.error("Email already exists!");
      return ERROR_RESPONSE(res, false, 409, "Email already exists!");
    }

    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
      return ERROR_RESPONSE(res, false, 500, "Error hashing password");
    }
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        userName,
        isVerified: false,
        verifyCode: generateVerificationCode(),
      },
    });
    return SUCCESS_RESPONSE(res, true, 201, user, "User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
    return ERROR_RESPONSE(res, false, 500, "Internal Server Error");
  }
};
