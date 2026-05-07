import { prisma } from "../../lib/prisma";
import asyncHandler from "../../middlewares/asynchandler";
import ErrorResponse from "../../utils/errorResponse";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const Register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists)
    throw new ErrorResponse("User already exists with this email", 400);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: { name: true, email: true, role: true },
  });
  res.status(201).json({ success: true, user });
});

export const Login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ErrorResponse("Email does not exist, try again", 400);
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    throw new ErrorResponse("Password is incorrect, try again", 400);

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret)
    throw new ErrorResponse("JWT secret is not configured", 500);

  const token = jwt.sign({ id: user.id }, jwtSecret, {
    expiresIn: "7d",
  });

  res
    .status(200)
    .json({
      success: true,
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
});

export const GetMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});
