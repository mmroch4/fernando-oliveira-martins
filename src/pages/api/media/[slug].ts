import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import stream from "stream";
import { promisify } from "util";
import { GetAssetDocument, GetAssetQuery } from "../../../graphql/schema";
import { apolloClient } from "../../../lib/apollo";

const pipeline = promisify(stream.pipeline);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const { slug } = req.query;

  try {
    const {
      data: { asset },
    } = await apolloClient.query<GetAssetQuery>({
      query: GetAssetDocument,
      variables: {
        slug,
      },
    });

    if (!asset) {
      res.status(404).json(`File (${slug}) could not be found`);
    } else if (!asset.downloadable) {
      res.status(404).json(`File (${slug}) can not be downloaded`);
    } else if (asset && asset.downloadable) {
      const download = await fetch(asset.url);

      if (!download.ok || !download.body) throw new Error();

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${asset.fileName}`
      );

      await pipeline(download.body, res);
    }
  } catch (err) {
    console.log(err);

    res.status(500).json(`Error on downloading file (${slug})`);
  }
}
