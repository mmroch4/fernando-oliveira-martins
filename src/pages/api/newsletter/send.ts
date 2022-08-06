import type { NextApiRequest, NextApiResponse } from "next";
import { markdown } from "nodemailer-markdown";
import { mailer } from "../../../lib/mailer";
import { verifyWebhookSignature } from "../../../services/verify-webhook-signature";

// "data": {
//     "__typename": "Email",
//     "content": "# meu titulo\n\n## meu subtitulo\n\naqui mermao",
//     "createdAt": "2022-08-05T23:14:08.619894+00:00",
//     "createdBy": {
//       "__typename": "User",
//       "id": "cl08dlo5i3jl101z33sjudks3"
//     },
//     "id": "cl6h333ow12f60bmo5z6cvj8i",
//     "publishedAt": "2022-08-06T12:34:11.745848+00:00",
//     [Newsletter] - Send email
// "publishedBy": {
//       "__typename": "User",
//       "id": "cl08dlo5i3jl101z33sjudks3"
//     },
//     "scheduledIn": [],
//     "stage": "PUBLISHED",
//     "subject": "sasha teu tio",
//     "updatedAt": "2022-08-05T23:33:49.752542+00:00",
//     "updatedBy": {
//       "__typename": "User",
//       "id": "cl08dlo5i3jl101z33sjudks3"
//     }
//   }

const secret = process.env.SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req)

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

      await mailer.sendMail({
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
