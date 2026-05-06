import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: any;
}

type AsyncController = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => Promise<any>;

const asyncHandler = (fn: AsyncController) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
