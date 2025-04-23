import { NextFunction, Request, Response } from "express";
import { ERROR_RESPONSE } from "../lib/customHandler";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}
export const isAuthenticated = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  let token = req.headers.authorization || req.body.token;

  if (!token) {
    return ERROR_RESPONSE(res, false, 401, "Token is not Provided");
  }
  token = token.split("Bearer")[1];
  console.log("token", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return ERROR_RESPONSE(res, false, 401, "Unauthorized User");
  }
};
