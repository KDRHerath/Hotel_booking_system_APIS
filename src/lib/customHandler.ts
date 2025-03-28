import { type Response } from "express";

export const SUCCESS_RESPONSE = (
  res: Response,
  status: boolean,
  statusCode: number,
  data: object | undefined,
  message: string,
  pagination?: object
): any => {
  res.status(statusCode).json({
    status,
    data,
    message,
    pagination,
  });
};

export const ERROR_RESPONSE = (
  res: Response,
  status: boolean,
  statusCode: number,
  message: string
): any => {
  res.status(statusCode).json({
    status,
    error: message,
  });
};
