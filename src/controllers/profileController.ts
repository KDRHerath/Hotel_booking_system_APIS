import { Request, Response } from "express";
import { ERROR_RESPONSE, SUCCESS_RESPONSE } from "../lib/customHandler";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../lib/db";

type User = {
  id: string;
  email: string;
};
interface AuthenticatedRequest extends Request {
  user?: User | JwtPayload;
}

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    console.log("userIddsfsdfsdfsfsd", userId);
    if (!userId) {
      return ERROR_RESPONSE(res, false, 401, "Error in User id User");
    }
    const user = await prisma.user.findUnique({
      where: { id: userId as string },
    });
    if (!user) {
      return ERROR_RESPONSE(res, false, 404, "User not found");
    }
    return SUCCESS_RESPONSE(res, true, 200, user, "User fetched successfully");
  } catch (error) {
    console.error("Error fetching user:", error);
    return ERROR_RESPONSE(res, false, 500, "Internal Server Error");
  }
};
