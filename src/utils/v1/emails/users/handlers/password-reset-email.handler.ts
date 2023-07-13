import { User } from "@prisma/client";
import { transportInit } from "../../transporter-client.email";

export const userPasswordResetMail = async (user: User, url: string) => {
  const mailOptions = {
    from: "stardom@mail.io",
    to: user.email,
    subject: "Password Reset",
    text: `This is the password reset link to reset your password: ${url}`,
  };

  try {
    const transporter = await transportInit();
    transporter!.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
  }
};
