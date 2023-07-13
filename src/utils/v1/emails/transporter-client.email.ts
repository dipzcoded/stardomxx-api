import nodemailer from "nodemailer";

// import https from "https";

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.EMAIL_MAILTRAP_USERNAME!,
    pass: process.env.EMAIL_MAILTRAP_PASSWORD!,
  },
});

export const transportInit = async () => {
  try {
    await transporter.verify();
    return transporter;
  } catch (error) {
    console.error("Error connecting to the mail server:", error);
  }
};
