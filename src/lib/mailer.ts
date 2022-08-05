import { createTransport } from "nodemailer";

const smtp = {
  host: String(process.env.MAIL_HOST),
  port: Number(process.env.MAIL_PORT),
  user: String(process.env.MAIL_USER),
  pass: String(process.env.MAIL_PASS),
};

export const mailer = createTransport({
  host: smtp.host,
  port: smtp.port,
  auth: {
    user: smtp.user,
    pass: smtp.pass,
  },
});
