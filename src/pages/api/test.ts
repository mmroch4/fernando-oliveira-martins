import type { NextApiRequest, NextApiResponse } from "next";
import { mailer } from "../../lib/mailer";
import { verifyWebhookSignature } from "../../services/verify-webhook-signature";

const secret = "kjblajshvdojhasdljahsvdljashvdashvdlajshvdasljhdvaljs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req;
  const { "gcms-signature": signature } = req.headers;

  console.log(req.body);
  console.log(signature);

  const isValid = verifyWebhookSignature({
    body,
    signature: signature as string,
    secret,
  });

  if (!isValid) {
    res.status(400).json({
      ok: false,
      message: "Invalid request",
    });
  } else {
    const to: string[] = ["dump.miguelrocha.dev@gmail.com"];

    try {
      const email = await mailer.sendMail({
        from: {
          name: "Fernando Oliveira Martins",
          address: process.env.MAIL_USER as string,
        },
        to,

        subject: "meu assunto",

        html: `
          <div style="display:flex;flex-direction:row;align-items:center;justify-content:space-between;">
            <h1 style="color:red;">Meu super fodastico email</h1>
            <p style="color:blue;"><strong>novidades</strong> por aqui fml</p>
          </div>
        `,
      });

      console.log(email);

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
