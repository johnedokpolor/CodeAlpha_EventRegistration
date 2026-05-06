import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ErrorResponse from "../utils/errorResponse";
import { prisma } from "../lib/prisma";
import asyncHandler from "./asynchandler";

// Extend the Express Request type locally
interface AuthRequest extends Request {
  user?: any;
}

const Protect = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    // 1. Check if token exists in the Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new ErrorResponse("Not authorized to access this route", 401);
    }

    try {
      // 2. Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      ) as any;

      // 3. Attach user to the request object
      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, role: true }, // Don't fetch the password
      });

      next();
    } catch (error) {
      throw new ErrorResponse("Not authorized to access this route", 401);
    }
  },
);

export default Protect;
