import { User } from "@prisma/client";
import axios from "axios";
import FormData from "form-data";
// import https from "https";

const formData = new FormData();

export const sendActivationTokenToUserMail = async (
  user: User,
  url: string
) => {
  // const axiosAgent = new https.Agent({
  //   rejectUnauthorized: false,
  // });
  // console.log(`calling: ${user.email}`);
  formData.append("to", user.email);
  formData.append("subject", "Activate Account");
  formData.append(
    "text",
    `This is the activation link to verify your account: ${url}`
  );
  formData.append(
    "html",
    `<p>This is the activation link to verify your account: <a href=${url}>activate</a></p>`
  );

  try {
    await axios.post(process.env.EMAIL_SENDING_URL!, formData);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
