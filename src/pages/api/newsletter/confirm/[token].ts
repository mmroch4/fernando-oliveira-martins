import { verify } from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  GetReaderDocument,
  GetReaderQuery,
  RegisterReaderDocument,
} from "../../../../graphql/schema";
import { apolloClient } from "../../../../lib/apollo";
import { mailer } from "../../../../lib/mailer";
import { domain } from "../../../../utils/domain";

interface DecodedJWT {
  sub: string;
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return res.status(400).json({
      ok: false,
      message: "token invalido",
    });
  }

  try {
    const { sub: email } = verify(token, JWT_SECRET) as DecodedJWT;

    const {
      data: { reader },
    } = await apolloClient.query<GetReaderQuery>({
      query: GetReaderDocument,
      variables: {
        email,
      },
    });

    if (reader) {
      throw new Error(`${email} já está registrado em nossa newsletter`);
    }

    const {
      data: { createReader, publishReader },
      errors,
    } = await apolloClient.mutate({
      mutation: RegisterReaderDocument,
      variables: {
        email,
      },
    });

    if (errors && errors.length > 0) {
      const uniqueError = errors.find(
        (error) => error.message === 'value is not unique for the field "email"'
      );

      if (uniqueError) {
        throw new Error(`${email} já está registrado em nossa newsletter`);
      }

      throw new Error("Não foi possível se registrar em nossa newsletter");
    }

    await mailer.sendMail({
      from: {
        name: "Fernando Oliveira Martins",
        address: process.env.MAIL_USER as string,
      },
      to: email,

      subject: "Importante: Inscrição confirmada com sucesso",
      html: `<main style="box-sizing: border-box; width: 100%">
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
          Inscrição em nossa newsletter concluída com sucesso!
        </h1>

        <a
          href="${domain}/"
          target="_blank"
          rel="noreferrer"
          style="
            box-sizing: border-box;
            padding: 0.5rem 1rem;
            background: #0d6efd;
            color: white;
            text-decoration: none;
            font-weight: bold;
            border-radius: 5px;
            font-size: 20px;
          "
          >Continuar navegando</a
        >

        <p
          style="
            box-sizing: border-box;
            font-size: 18px;
            line-height: 24px;
            margin-top: 2rem;
          "
        >
          Obrigado por fazer sua inscrição em nossa newsletter!
        </p>

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

        <p style="box-sizing: border-box; font-size: 18px; line-height: 24px">
          <strong style="box-sizing: border-box">Importante:</strong> coloque
          este email na sua caixa de entrada para garantir que as newsletters
          sejam recebidas corretamente.
        </p>
      </div>
    </main>`,
    });

    res.status(200).json({
      ok: true,
      message: `${email} foi registrado com sucesso em nossa newsletter`,
      payload: {
        email,
      },
    });
  } catch (err: any) {
    console.log(err);

    res.status(400).json({
      ok: false,
      message: err.message,
    });
  }
}
