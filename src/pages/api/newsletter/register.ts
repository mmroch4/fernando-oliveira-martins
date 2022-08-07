import { Magic } from "@magic-sdk/admin";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  GetReaderDocument,
  GetReaderQuery,
  RegisterReaderDocument,
} from "../../../graphql/schema";
import { apolloClient } from "../../../lib/apollo";

const MAGIC_SECRET_KEY = process.env.MAGIC_SECRET_KEY as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(400).json({
      ok: false,
      message: "Não foi possível se registrar em nossa newsletter",
    });

    return;
  }

  const magic = new Magic(MAGIC_SECRET_KEY);

  const [, didToken] = authorization.split(" ");

  const { email } = await magic.users.getMetadataByToken(didToken);

  if (!email) {
    res.status(400).json({
      ok: false,
      message: "Não foi possível se registrar em nossa newsletter",
    });

    return;
  }

  try {
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

    res.status(200).json({
      ok: true,
      message: `${email} registrado com sucesso em nossa newsletter`,
      payload: {
        createded: createReader.email,
        published: publishReader.email,
      },
    });
  } catch (err: any) {
    res.status(400).json({
      ok: false,
      message: err.message,
    });
  }
}
