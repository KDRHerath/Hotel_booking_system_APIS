import { ERROR_RESPONSE, SUCCESS_RESPONSE } from "../lib/customHandler";
import { Request, Response } from "express";
import prisma from "../lib/db";
import { hashPassword } from "../lib/argon2Hash";
import { sendEmail } from "../lib/mailer";

export const userRegistaration = async (req: Request, res: Response) => {
  const { email, password, userName } = req.body;
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000); // e.g., "839274"
  };

  const verificationCode = generateVerificationCode();

  console.log("generateVerificationCode", verificationCode);
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
        verifyCode: verificationCode,
      },
    });
    await sendEmail(
      email,
      "Verify your account",
      `<p>Your verification code is: <strong>${verificationCode}</strong></p>`
    );

    return SUCCESS_RESPONSE(res, true, 201, user, "User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
    return ERROR_RESPONSE(res, false, 500, "Internal Server Error");
  }
};

export const reSendVerificationCode = async (req: Request, res: Response) => {
  const { email } = req.body;
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000); // e.g., "839274"
  };

  try {
    const isVerified = await prisma.user.findUnique({
      where: { email: email },
      select: { isVerified: true },
    });
    console.log("isVerified", isVerified);
    if (!isVerified) {
      return ERROR_RESPONSE(res, false, 409, "Email already verified!");
    }

    const verificationCode = generateVerificationCode();

    const user = await prisma.user.update({
      where: { email: email },
      data: {
        verifyCode: verificationCode,
      },
    });
    await sendEmail(
      email,
      "Verify your account",
      `<p>Your verification code is: <strong>${verificationCode}</strong></p>`
    );
    return SUCCESS_RESPONSE(
      res,
      true,
      200,
      user,
      "Verification code resent successfully"
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return ERROR_RESPONSE(res, false, 500, "Internal Server Error");
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  const { email, verificationCode } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    console.log("user", user);
    console.log("verificationCode", verificationCode);
    if (!user) {
      return ERROR_RESPONSE(res, false, 404, "User not found");
    }

    if (user.isVerified) {
      return ERROR_RESPONSE(res, false, 409, "User already verified");
    }

    if (user.verifyCode != verificationCode) {
      return ERROR_RESPONSE(res, false, 400, "Invalid verification code");
    }

    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: { isVerified: true },
    });

    return SUCCESS_RESPONSE(
      res,
      true,
      200,
      updatedUser,
      "User verified successfully"
    );
  } catch (error) {
    console.error("Error verifying user:", error);
    return ERROR_RESPONSE(res, false, 500, "Internal Server Error");
  }
};
