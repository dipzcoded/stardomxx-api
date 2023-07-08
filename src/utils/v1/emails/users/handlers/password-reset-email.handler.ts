import { User } from "@prisma/client";
import axios from "axios";
import FormData from "form-data";
import https from "https";

const formData = new FormData();

export const userPasswordResetMail = async (user: User, url: string) => {
  // console.log(`calling: ${user.email}`);
  const axiosAgent = new https.Agent({
    rejectUnauthorized: false,
  });
  formData.append("to", user.email);
  formData.append("subject", "Reset Password");
  formData.append("text", `This is a password reset link: ${url}`);
  formData.append(
    "html",
    `<p>This is a password reset link: <a href=${url}>reset</a></p>`
  );

  try {
    await axios.post(process.env.EMAIL_SENDING_URL!, formData, {
      httpsAgent: axiosAgent,
    });
    return;
  } catch (err) {
    throw err;
  }
};
