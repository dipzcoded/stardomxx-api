import { User } from "@prisma/client";
import axios from "axios";
import FormData from "form-data";
import { convert } from "html-to-text";

export const sendActivationTokenToUserMail = async (
  user: User,
  url: string
) => {
  const formData = new FormData();
  formData.append("to", user.email);
  formData.append("subject", "Account Activation");
  formData.append(
    "text",
    convert(
      `<p>This is the activation link to verify your account: <a href=${url}>Activation Link</a></p>`
    )
  );
  formData.append(
    "html",
    `<p>This is the activation link to verify your account: <a href=${url}>Activation Link</a></p>`
  );

  try {
    await axios.post(process.env.EMAIL_SENDING_URL!, formData);
  } catch (error) {
    console.error(error);
  }
};
