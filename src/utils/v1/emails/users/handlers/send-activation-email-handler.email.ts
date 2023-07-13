import { User } from "@prisma/client";
import { transportInit } from "../../transporter-client.email";

export const sendActivationTokenToUserMail = async (
  user: User,
  url: string
) => {
  const mailOptions = {
    from: "stardom@mail.io",
    to: user.email,
    subject: "Activate Account",
    text: `This is the activation link to verify your account: ${url}`,
  };

  try {
    const transporter = await transportInit();
    transporter!.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
  }
};
