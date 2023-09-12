import { User } from "@prisma/client";
import { convert } from "html-to-text";
import axios from "axios";

export const userPasswordResetMail = async (user: User, url: string) => {
  const formData = new FormData();
  formData.append("to", user.email);
  formData.append("subject", "Password Reset");
  formData.append(
    "text",
    convert(
      `<p>This is the password reset link to reset your password: <a href=${url}>Reset Password</a></p>`
    )
  );
  formData.append(
    "html",
    `<p>This is the password reset link to reset your password: <a href=${url}>Reset Password</a></p>`
  );

  try {
    await axios.post(process.env.EMAIL_SENDING_URL!, formData);
  } catch (error) {
    console.error(error);
  }
};
