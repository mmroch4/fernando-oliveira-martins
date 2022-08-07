import { astToHtmlString } from "@graphcms/rich-text-html-renderer";
import type { NextApiRequest, NextApiResponse } from "next";
import { GetReadersDocument, GetReadersQuery } from "../../../graphql/schema";
import { apolloClient } from "../../../lib/apollo";
import { mailer } from "../../../lib/mailer";
import { verifyWebhookSignature } from "../../../services/verify-webhook-signature";

interface Body {
  operation: "publish" | string;
  data: {
    __typename: "Email" | string;
    stage: "PUBLISHED" | string;
    id: string;
    subject: string;
    content: any;
    scheduledIn: [];
    createdAt: Date;
    createdBy: {
      __typename: "User" | string;
      id: string;
    };
    publishedAt: Date;
    publishedBy: {
      __typename: "User" | string;
      id: string;
    };
    updatedAt: Date;
    updatedBy: {
      __typename: "User" | string;
      id: string;
    };
  };
}

const secret = process.env.SECRET;
const token = process.env.TOKEN;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req;
  const { "gcms-signature": signature, "X-Token": sendToken } = req.headers;

  if (sendToken !== token) {
    res.status(400).json({
      ok: false,
      message: "Invalid request",
    });

    return;
  }

  const isValid = await verifyWebhookSignature({
    body,
    signature: signature as string,
    secret: secret as string,
  });

  if (!isValid) {
    res.status(400).json({
      ok: false,
      message: "Invalid request",
    });

    return;
  }

  const {
    data: { subject, content },
  } = body as Body;

  try {
    const {
      data: { readers },
    } = await apolloClient.query<GetReadersQuery>({
      query: GetReadersDocument,
    });

    const sendTo: string[] = readers.map((reader) => reader.email);

    const html = astToHtmlString({
      content: content.json,
    });

    await mailer.sendMail({
      from: {
        name: "Fernando Oliveira Martins",
        address: process.env.MAIL_USER as string,
      },
      to: sendTo,

      subject,
      html,
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
