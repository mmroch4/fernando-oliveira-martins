import type { NextApiRequest, NextApiResponse } from "next";
import { markdown } from "nodemailer-markdown";
import { mailer } from "../../../lib/mailer";
import { verifyWebhookSignature } from "../../../services/verify-webhook-signature";

const secret = process.env.SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req;
  const { "gcms-signature": signature } = req.headers;

  const isValid = verifyWebhookSignature({
    body,
    signature: signature as string,
    secret: secret as string,
  });

  if (!isValid) {
    res.status(400).json({
      ok: false,
      message: "Invalid request",
    });
  } else {
    const to: string[] = ["dump.miguelrocha.dev@gmail.com"];

    const {
      data: { subject, content },
    } = body;

    try {
      mailer.use("compile", markdown());

      const email = await mailer.sendMail({
        from: {
          name: "Fernando Oliveira Martins",
          address: process.env.MAIL_USER as string,
        },
        to,

        subject,
        markdown: content,
      });

      res.status(200).json({
        ok: true,
        message: "Everything ok",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        ok: false,
        message: "Unknown error",
      });
    }
  }
}
