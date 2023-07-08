import { User } from "@prisma/client";
import jsonwebtoken from "jsonwebtoken";

export const generateAccessToken = (user: User) => {
  const payload = {
    id: user.id!,
    role: user.role!,
    email: user.email!,
  };
  return jsonwebtoken.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN!,
  });
};
