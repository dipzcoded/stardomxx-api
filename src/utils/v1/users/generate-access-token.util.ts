import jsonwebtoken from "jsonwebtoken";

export const generateAccessToken = (userId: number) => {
  const payload = {
    user: {
      id: userId,
    },
  };
  return jsonwebtoken.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN!,
  });
};
