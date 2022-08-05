import type { NextApiRequest, NextApiResponse } from "next";
import { mailer } from "../../lib/mailer";
import { verifyWebhookSignature } from "../../services/verify-webhook-signature";

// ol(kHandle)]: TCP {
//       reading: true,
//       onconnection: null,
//       _consumed: true,
//       [Symbol(owner_symbol)]: [Circular *1]
//     },
//     [Symbol(lastWriteQueueSize)]: 0,
//     [Symbol(timeout)]: null,
//     [Symbol(kBuffer)]: null,
//     [Symbol(kBufferCb)]: null,
//     [Symbol(kBufferGen)]: null,
//     [Symbol(kCapture)]: false,
//     [Symbol(kSetNoDelay)]: false,
//     [Symbol(kSetKeepAlive)]: false,
//     [Symbol(kSetKeepAliveInitialDelay)]: 0,
//     [Symbol(kBytesRead)]: 0,
//     [Symbol(kBytesWritten)]: 0,
//     [Symbol(RequestTimeout)]: undefined
//   },
//   _consuming: true,
//   _dumped: false,
//   cookies: [Getter/Setter],
//   query: {},
//   previewData: [Getter/Setter],
//   preview: [Getter/Setter],
//   body: {
//     operation: 'publish',
//     data: {
//       __typename: 'Post',
//       archive: [Object],
//       categories: [Array],
//       content: [Object],
//       createdAt: '2022-08-05T15:08:25.091388+00:00',
//       createdBy: [Object],
//       id: 'cl6glqgeu0fel0bmiksuvfv9g',
//       publishedAt: '2022-08-05T15:08:25.69803+00:00',
//       publishedBy: [Object],
//       scheduledIn: [],
//       slug: 'meu-decimo-quinto-post',
//       stage: 'PUBLISHED',
//       subtitle: 'fdwfsdsdFFDDFSFD FEWFF',
//       title: 'meu decimo quinto post',
//       updatedAt: '2022-08-05T15:08:25.091388+00:00',
//       updatedBy: [Object]
//     }
//   },
//   [Symbol(kCapture)]: false,
//   [Symbol(kHeaders)]: {
//     host: 'preview.miguelrocha.dev',
//     'content-type': 'application/json',
//     'x-real-ip': '3.9.136.95',
//     'x-vercel-proxy-signature-ts': '1659712405',
//     'x-vercel-deployment-url': 'dumping-5h1vql9c9-miguelrocha.vercel.app',
//     'gcms-signature': 'sign=+TqzUpqLnNkxmAGwaoRHE4Xx/SYURnTh45oJgugFWKU=, env=master, t=1659712105',
//     'x-vercel-forwarded-for': '3.9.136.95',
//     forwarded: 'for=3.9.136.95;host=preview.miguelrocha.dev;proto=https;sig=0QmVhcmVyIDFlMTNiZjA1NTY5Zjg3N2Y0OWUzZTE0NDlhMTkyNTZiYTcxZjU2N2MxMDM0OGJmNDMwMWIzMDk1MDRjYjNiZWU=;exp=1659712405',
//     'x-vercel-id': 'lhr1::tmqdr-1659712105957-e2f125f43d89',
//     'x-forwarded-for': '3.9.136.95',
//     'x-matched-path': '/api/test',
//     'x-vercel-ip-longitude': '-0.093',
//     'x-forwarded-host': 'preview.miguelrocha.dev',
//     'x-vercel-ip-latitude': '51.5164',
//     'content-length': '890',
//     'x-vercel-ip-country': 'GB',
//     'x-forwarded-proto': 'https',
//     'x-vercel-proxy-signature': 'Bearer 1e13bf05569f877f49e3e1449a19256ba71f567c10348bf4301b309504cb3bee',
//     'accept-encoding': 'gzip',
//     'user-agent': 'Go-http-client/2.0',
//     'x-vercel-ip-country-region': 'ENG',
//     'x-vercel-ip-city': 'London',
//     'x-vercel-ip-timezone': 'Europe/London',
//     'x-vercel-proxied-for': '3.9.136.95',
//     connection: 'close'
//   },
//   [Symbol(kHeadersCount)]: 50,
//   [Symbol(kTrailers)]: null,
//   [Symbol(kTrailersCount)]: 0,
//   [Symbol(RequestTimeout)]: undefined,
//   [Symbol(NextRequestMeta)]: {
//     __NEXT_INIT_URL: '/api/test',
//     __NEXT_INIT_QUERY: {},
//     _protocol: 'http',
//     __nextHadTrailingSlash: false,
//     __nextIsLocaleDomain: false
//   }
// }
// {
//   operation: 'publish',
//   data: {
//     __typename: 'Post',
//     archive: { __typename: 'Archive', id: 'cl65hpq3guwg60bmi41zxyklm' },
//     categories: [ [Object] ],
//     content: {
//       __typename: 'PostContentRichText',
//       json: [Object],
//       references: []
//     },
//     createdAt: '2022-08-05T15:08:25.091388+00:00',
//     createdBy: { __typename: 'User', id: 'cl08dlo5i3jl101z33sjudks3' },
//     id: 'cl6glqgeu0fel0bmiksuvfv9g',
//     publishedAt: '2022-08-05T15:08:25.69803+00:00',
//     publishedBy: { __typename: 'User', id: 'cl08dlo5i3jl101z33sjudks3' },
//     scheduledIn: [],
//     slug: 'meu-decimo-quinto-post',
//     stage: 'PUBLISHED',
//     subtitle: 'fdwfsdsdFFDDFSFD FEWFF',
//     title: 'meu decimo quinto post',
//     updatedAt: '2022-08-05T15:08:25.091388+00:00',
//     updatedBy: { __typename: 'User', id: 'cl08dlo5i3jl101z33sjudks3' }
//   }
// }

const secret = "kjblajshvdojhasdljahsvdljashvdashvdlajshvdasljhdvaljs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req;
  const { "gcms-signature": signature } = req.headers;

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
    const mailToSend = await mailer.sendMail({
      text: "Meu mail de teste",
      subject: "meu assunto",
      from: "Miguel Rocha <miguelrocha.dev@gmail.com>",
      to: ["dump.miguelrocha.dev@gmail.com"],
    });

    console.log(mailToSend);

    res.status(200).json({
      ok: true,
      message: "Everything ok",
    });
  }
}
