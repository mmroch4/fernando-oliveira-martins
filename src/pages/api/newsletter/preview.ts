import { astToHtmlString } from "@graphcms/rich-text-html-renderer";
import { NextApiRequest, NextApiResponse } from "next/types";
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

const HYGRAPH_HOOK_PREVIEW_SECRET = process.env
  .HYGRAPH_HOOK_PREVIEW_SECRET as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req;
  const { "gcms-signature": signature } = req.headers;

  const isValid = await verifyWebhookSignature({
    body,
    signature: signature as string,
    secret: HYGRAPH_HOOK_PREVIEW_SECRET as string,
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
    const html = `<style>
      .default {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      #container * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      table p {
        margin: 0;
      }
    </style>

    <main id="container" class="default" style="width: 100%">
      <div
        style="
          width: 60%;
          margin-inline: auto;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
            Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
            sans-serif;
          font-size: 18px;
          color: #333333;
        "
      >

        ${astToHtmlString({
          content: content.json,
          references: content.references,
          renderers: {
            a: ({ children, href, openInNewTab, className }) =>
              `<a href="${href}" target="${
                openInNewTab ? "_blank" : "_self"
              }" rel="noreferrer noopener" style="${
                className === "botao"
                  ? `display: inline-block;
            margin-block: 0.5rem;
            padding: 0.5rem 1rem;
            border: 1px solid #0d6efd;
            background: #0d6efd;
            color: white;
            text-decoration: none;
            font-weight: bold;
            border-radius: 5px;`
                  : `color: #0d6efd;
            cursor: pointer;
            font-weight: bold;
            text-decoration: none;`
              }">${children}</a>`,
            h1: ({ children }) =>
              `<h1 style="margin-block: 1.5rem">${children}</h1>`,
            h2: ({ children }) =>
              `<h2 style="margin-block: 1.25rem">${children}</h2>`,
            h3: ({ children }) =>
              `<h3 style="margin-block: 1rem">${children}</h3>`,
            h4: ({ children }) =>
              `<h4 style="margin-block: 0.75rem">${children}</h4>`,
            h5: ({ children }) =>
              `<h5 style="margin-block: 0.5rem">${children}</h5>`,
            h6: ({ children }) =>
              `<h6 style="margin-block: 0.25rem">${children}</h6>`,
            p: ({ children }) =>
              `<p style="line-height: 24px; margin-block: 0.6rem">${children}</p>`,
            ul: ({ children }) => `<ul style="
            list-style-position: inside;
            margin-block: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          ">${children}</ul>`,
            ol: ({ children }) => `<ol style="
            list-style-position: inside;
            margin-block: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          ">${children}</ol>`,
            li: ({ children }) => `<li>${children}</li>`,
            table: ({ children }) =>
              `<table style="width: 100%; border-collapse: collapse; margin-block: 1rem">${children}</table>`,
            table_head: ({ children }) =>
              `<thead style="width: 100%; background: #e4e4e4">${children}</thead>`,
            table_header_cell: ({ children }) => `<th style="
                  cursor: pointer;
                  padding: 0.2rem 0.4rem;
                  border: 1px solid #e4e4e4;
                  line-height: 100%;
                  text-align: left;
                ">${children}</th>`,
            table_body: ({ children }) =>
              `<tbody style="width: 100%;">${children}</tbody>`,
            table_row: ({ children }) =>
              `<tr style="height: 2.5rem">${children}</tr>`,
            table_cell: ({ children }) => `<td style="
                  cursor: pointer;
                  padding: 0.2rem 0.4rem;
                  border: 1px solid #e4e4e4;
                  line-height: 100%;
                  text-align: left;
                "${children}</td>`,
            blockquote: ({ children }) => `<blockquote style="
            background: #e4e4e4;
            border-left: 4px solid #0d6efd;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
            margin-block: 1rem;
            padding: 0.5rem 1rem;
          ">${children}</blockquote>`,
            bold: ({ children }) => `<strong>${children}</strong>`,
            italic: ({ children }) => `<em>${children}</em>`,
            underline: ({ children }) => `<u>${children}</u>`,
            code: ({ children }) => `<code style="
            background: #e4e4e4;
            font-size: 0.875rem;
            font-family: inherit;
            letter-spacing: 0.1rem;
            border-radius: 5px;
            padding: 0.25rem 0.5rem;
          ">${children}</code>`,
            code_block: ({ children }) => `<pre style="
            background: #e4e4e4;
            border-radius: 5px;
            margin-block: 1rem;
            padding: 0.5rem 1rem;
            line-height: 1.2rem;
          "><code style="
            background: transparent;
            border-radius: none;
            padding: none;
            letter-spacing: normal;
          ">${children}</code></pre>`,
            iframe: ({ url, width, height }) =>
              `<iframe src="${url}" width="${width ? width : "auto"}" height="${
                height ? height : "auto"
              }" frameborder="0" style="width: auto; height: auto; margin-block: 1rem"></iframe>`,
            video: ({ src, title, width, height }) =>
              `<video src="${src}" controls title="${
                title ? title : `Ir para: ${src}`
              }" width="${width ? width : "auto"}" height="${
                height ? height : "auto"
              }" style="max-width: 100%; height: auto; margin-block: 1rem"></video>`,
            img: ({ src, altText, title, width, height }) =>
              `<img src="${src}" alt="${altText || ""}" title="${
                title || "Minha imagem"
              }" width="${width ? width : "auto"}" height="${
                height ? height : "auto"
              }" style="max-width: 100%; height: auto; margin-block: 1rem">`,
            class: ({ className, children }) => {
              return className === "divisor"
                ? `<hr
          style="
            width: 100%;
            border: none;
            height: 1px;
            background: #e4e4e4;
            margin: 1.5rem 0 1rem;
          "
        />`
                : `<div class="${className}">${children}</div>`;
            },
            Asset: {
              image: ({ url, id }) =>
                `<img src="${url}" data-gcms-id="${id}" width="auto" height="auto"  style="max-width: 100%; height: auto; margin-block: 1rem">`,
              video: ({ url, id }) =>
                `<video src="${url}" data-gcms-id="${id}" width="auto" height="auto" controls style="max-width: 100%; height: auto; margin-block: 1rem"></video>`,
              audio: ({ url, id }) =>
                `<audio src="${url}" data-gcms-id="${id}" controls style="max-width: 100%; height: auto; margin-block: 1rem"></audio>`,
              application: ({ url, id }) =>
                `<a href="${url}" data-gcms-id="${id}" target="_blank" style="color: inherit; text-decoration: none">
                <div
            style="
              margin-block: 1rem;
              border: 1px solid #e4e4e4;
              border-radius: 5px;
              padding: 0.5rem 1rem;
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
            "
          >
            <h2>Arquivo</h2>
            <p>${id}</p>
          </div>
          </a>`,
              text: ({ url, id }) =>
                `<a href="${url}" data-gcms-id="${id}" target="_blank" style="color: inherit; text-decoration: none">
            <div
            style="
              margin-block: 1rem;
              border: 1px solid #e4e4e4;
              border-radius: 5px;
              padding: 0.5rem 1rem;
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
            "
          >
            <h2>Arquivo</h2>
            <p>${id}</p>
          </div>
          </a>`,
              model: ({ url, id }) =>
                `<a href="${url}" data-gcms-id="${id}" target="_blank" style="color: inherit; text-decoration: none">
            <div
            style="
              margin-block: 1rem;
              border: 1px solid #e4e4e4;
              border-radius: 5px;
              padding: 0.5rem 1rem;
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
            "
          >
            <h2>Arquivo</h2>
            <p>${id}</p>
          </div>
          </a>`,
              font: ({ url, id }) =>
                `<a href="${url}" data-gcms-id="${id}" target="_blank" style="color: inherit; text-decoration: none">
            <div
            style="
              margin-block: 1rem;
              border: 1px solid #e4e4e4;
              border-radius: 5px;
              padding: 0.5rem 1rem;
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
            "
          >
            <h2>Arquivo</h2>
            <p>${id}</p>
          </div>
          </a>`,
            },

            embed: {
              Asset: ({ id }) => `<div
          style="
            margin-block: 1rem;
            border: 1px solid #e4e4e4;
            border-radius: 5px;
            padding: 0.5rem 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          "
        >
          <h2>Arquivo</h2>
          <p>${id}</p>
        </div>`,
            },
          },
        })}

        <hr
          style="
            width: 100%;
            border: none;
            height: 1px;
            background: #e4e4e4;
            margin: 1.5rem 0 1rem;
          "
        />

        <p style="font-size: 18px; line-height: 24px; margin-block: 0.6rem">
          <strong style="box-sizing: border-box">Importante:</strong> coloque
          este email na sua caixa de entrada para garantir que as newsletters
          sejam recebidas corretamente.
        </p>
      </div>
    </main>`;

    await mailer.sendMail({
      from: {
        name: "Fernando Oliveira Martins",
        address: process.env.MAIL_USER as string,
      },
      to: process.env.MAIL_USER as string,

      subject: `[Newsletter preview]: ${subject}`,
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
