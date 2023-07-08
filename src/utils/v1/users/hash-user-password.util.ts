import { User } from "@prisma/client";
import argon2 from "argon2";

export const hashUserPassword = (password: string) => {
  return argon2.hash(password);
};

export const compareUserPassword = (loginPassword: string, user: User) => {
  return argon2.verify(user.password!, loginPassword);
};
