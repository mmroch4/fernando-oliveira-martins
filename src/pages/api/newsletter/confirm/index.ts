import { sign } from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import isEmail from "validator/lib/isEmail";
import { mailer } from "../../../../lib/mailer";
import { domain } from "../../../../utils/domain";

const JWT_SECRET = process.env.JWT_SECRET as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.body;

  if (!email || !isEmail(email)) {
    return res.status(400).json({
      ok: false,
      message:
        "Para se registrar em nossa newsletter é necessário um endereço de email válido",
    });
  }

  const token = sign(
    {
      email,
    },
    JWT_SECRET,
    {
      subject: email,
      expiresIn: "10m",
    }
  );

  await mailer.sendMail({
    from: {
      name: "Fernando Oliveira Martins",
      address: process.env.MAIL_USER as string,
    },
    to: email,

    subject: "Importante: Confirme aqui sua inscrição",
    html: `
    <main style="box-sizing: border-box; width: 100%">
      <div
        style="
          box-sizing: border-box;
          width: 60%;
          margin-inline: auto;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
            Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
            sans-serif;
          color: #333333;
        "
      >
        <h1 style="box-sizing: border-box; margin-bottom: 1.5rem">
          Confirme sua inscrição clicando no botão abaixo.
        </h1>

        <a
          href="${domain}/newsletter/confirmar/${token}"
          target="_blank"
          rel="noreferrer"
          style="
            box-sizing: border-box;
            padding: 0.5rem 1rem;
            background: #0d6efd;
            color: white;
            text-decoration: none;
            font-weight: bold;
            font-size: 20px;
            border-radius: 5px;
          "
          >Confirmar inscrição</a
        >

        <hr
          style="
            box-sizing: border-box;
            width: 100%;
            border: none;
            height: 1px;
            background: #e4e4e4;
            margin: 1.5rem 0 1rem;
          "
        />

        <p style="box-sizing: border-box; font-size: 18px; line-height: 24px;">
          <strong style="box-sizing: border-box">Importante:</strong> coloque
          este email na sua caixa de entrada para garantir que as newsletters
          sejam recebidas corretamente.
        </p>
      </div>
    </main>
    `,
  });

  return res.status(200).json({
    ok: true,
    message: "Token criado com sucesso",
    payload: {
      token,
    },
  });
}
