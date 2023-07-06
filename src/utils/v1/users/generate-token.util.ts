import crypto from "crypto";

export const setToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
