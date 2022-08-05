import type { NextApiRequest, NextApiResponse } from "next";

const secret = "kjblajshvdojhasdljahsvdljashvdashvdlajshvdasljhdvaljs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req;

  console.log(body);

  res.json({ body });
}
