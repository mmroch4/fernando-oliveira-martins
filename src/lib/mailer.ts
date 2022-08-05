import { createTransport } from "nodemailer";

const smtp = {
  host: "smtp.gmail.com",
  port: 587,
  user: process.env.MAIL_ACCOUNT,
  pass: process.env.MAIL_PASS,
};

export const mailer = createTransport({
  host: smtp.host,
  port: smtp.port,
  secure: false,
  auth: {
    user: smtp.user,
    pass: smtp.pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
