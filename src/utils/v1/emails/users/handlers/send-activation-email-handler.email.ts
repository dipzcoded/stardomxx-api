import { User } from "@prisma/client";
import axios from "axios";
import FormData from "form-data";
import https from "https";

const formData = new FormData();
const axiosAgent = new https.Agent({
  rejectUnauthorized: false,
});

export const sendActivationTokenToUserMail = async (
  user: User,
  activationToken: string
) => {
  formData.append("to", user.email);
  formData.append("subject", "Activate Account");
  formData.append(
    "text",
    `This is the activation link to verify your account: ${activationToken}`
  );
  formData.append(
    "html",
    `<p>This is the activation link to verify your account: ${activationToken}</p>`
  );

  try {
    await axios.post(process.env.EMAIL_SENDING_URL!, formData, {
      httpsAgent: axiosAgent,
    });
  } catch (err) {
    throw err;
  }
};
