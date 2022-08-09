import {
  astToHtmlString,
  RichTextProps,
} from "@graphcms/rich-text-html-renderer";
import type { NextPage } from "next";

const JSON = {
  operation: "publish",
  data: {
    __typename: "Email",
    content: {
      __typename: "EmailContentRichText",
      json: {
        children: [
          {
            children: [
              {
                text: "titulo 1",
              },
            ],
            type: "heading-one",
          },
          {
            children: [
              {
                text: "titulo 2",
              },
            ],
            type: "heading-two",
          },
          {
            children: [
              {
                text: "titulo 3",
              },
            ],
            type: "heading-three",
          },
          {
            children: [
              {
                text: "titulo 4",
              },
            ],
            type: "heading-four",
          },
          {
            children: [
              {
                text: "titulo 5",
              },
            ],
            type: "heading-five",
          },
          {
            children: [
              {
                text: "titulo 6",
              },
            ],
            type: "heading-six",
          },
          {
            children: [
              {
                text: "texto normal",
              },
            ],
            type: "paragraph",
          },
          {
            children: [
              {
                bold: true,
                text: "texto negrito",
              },
            ],
            type: "paragraph",
          },
          {
            children: [
              {
                italic: true,
                text: "texto italico",
              },
            ],
            type: "paragraph",
          },
          {
            children: [
              {
                text: "texto underline",
                underline: true,
              },
            ],
            type: "paragraph",
          },
          {
            children: [
              {
                text: "",
              },
              {
                children: [
                  {
                    text: "meu link ur",
                  },
                ],
                href: "https://docs.google.com/forms/d/e/1FAIpQLSeCbL0aSdex5GmuT6co8_0Qe3UkpIXnjdt5Pjxk2i__GM14eA/viewform",
                openInNewTab: true,
                type: "link",
              },
              {
                text: "l",
              },
            ],
            type: "paragraph",
          },
          {
            children: [
              {
                text: "",
              },
              {
                children: [
                  {
                    text: "Meu link de botao",
                  },
                ],
                className: "botao",
                href: "https://docs.google.com/forms/d/e/1FAIpQLSfX0rvO-7dwXKgRV7OahofRYOWu5_xM259YTz96XOvRAH8Cow/viewform",
                openInNewTab: true,
                type: "link",
              },
              {
                text: "",
              },
            ],
            type: "paragraph",
          },
          {
            children: [
              {
                text: "meu block quote",
              },
            ],
            type: "block-quote",
          },
          {
            children: [
              {
                code: true,
                text: "meu codigo",
              },
            ],
            type: "paragraph",
          },
          {
            children: [
              {
                children: [
                  {
                    children: [
                      {
                        text: "lista sem ordem 1",
                      },
                    ],
                    type: "list-item-child",
                  },
                ],
                type: "list-item",
              },
              {
                children: [
                  {
                    children: [
                      {
                        text: "lista sem ordem 2",
                      },
                    ],
                    type: "list-item-child",
                  },
                ],
                type: "list-item",
              },
              {
                children: [
                  {
                    children: [
                      {
                        text: "lista sem ordem 3",
                      },
                    ],
                    type: "list-item-child",
                  },
                ],
                type: "list-item",
              },
            ],
            type: "bulleted-list",
          },
          {
            children: [
              {
                children: [
                  {
                    children: [
                      {
                        text: "lista com ordem 1",
                      },
                    ],
                    type: "list-item-child",
                  },
                ],
                type: "list-item",
              },
              {
                children: [
                  {
                    children: [
                      {
                        text: "lista com ordem 2",
                      },
                    ],
                    type: "list-item-child",
                  },
                ],
                type: "list-item",
              },
              {
                children: [
                  {
                    children: [
                      {
                        text: "lista com ordem 3",
                      },
                    ],
                    type: "list-item-child",
                  },
                ],
                type: "list-item",
              },
            ],
            type: "numbered-list",
          },
          {
            children: [
              {
                text: "bloco de codigo",
              },
            ],
            type: "code-block",
          },
          {
            children: [
              {
                children: [
                  {
                    children: [
                      {
                        children: [
                          {
                            children: [
                              {
                                text: "cabecalho 1",
                              },
                            ],
                            type: "paragraph",
                          },
                        ],
                        type: "table_header_cell",
                      },
                      {
                        children: [
                          {
                            children: [
                              {
                                text: "cabecalho2",
                              },
                            ],
                            type: "paragraph",
                          },
                        ],
                        type: "table_header_cell",
                      },
                    ],
                    type: "table_row",
                  },
                ],
                type: "table_head",
              },
              {
                children: [
                  {
                    children: [
                      {
                        children: [
                          {
                            children: [
                              {
                                text: "conteudo 1",
                              },
                            ],
                            type: "paragraph",
                          },
                        ],
                        type: "table_cell",
                      },
                      {
                        children: [
                          {
                            children: [
                              {
                                text: "conteudo 2",
                              },
                            ],
                            type: "paragraph",
                          },
                        ],
                        type: "table_cell",
                      },
                    ],
                    type: "table_row",
                  },
                ],
                type: "table_body",
              },
            ],
            type: "table",
          },
          {
            children: [
              {
                text: "",
              },
            ],
            handle: "sy6zRoabT6usU8YMqfK1",
            height: 600,
            mimeType: "image/png",
            src: "https://media.graphassets.com/sy6zRoabT6usU8YMqfK1",
            title: "Spotify.png",
            type: "image",
            width: 2403,
          },
          {
            children: [
              {
                text: "",
              },
            ],
            handle: "C0Vh9jpcS7OmJpu8VrBC",
            height: null,
            mimeType: "video/mp4",
            src: "https://media.graphassets.com/C0Vh9jpcS7OmJpu8VrBC",
            title: "gangsta-de-uberlandia-nopixel-sa-shorts-gtarp.mp4",
            type: "video",
            width: null,
          },
          {
            children: [
              {
                text: "",
              },
            ],
            nodeId: "cl6l74ahs1lj20fmijbtmx4oa",
            nodeType: "Asset",
            type: "embed",
          },
          {
            children: [
              {
                children: [
                  {
                    text: "divisor",
                  },
                ],
                type: "paragraph",
              },
            ],
            className: "divisor",
            type: "class",
          },
          {
            children: [
              {
                text: "",
              },
            ],
            type: "paragraph",
          },
        ],
      },
      references: [
        {
          __typename: "Asset",
          id: "cl6l74ahs1lj20fmijbtmx4oa",
        },
      ],
    },
    createdAt: "2022-08-08T02:05:34.464095+00:00",
    createdBy: {
      __typename: "User",
      id: "cl08dlo5i3jl101z33sjudks3",
    },
    id: "cl6k439na4dyf0blcqz3pnq06",
    publishedAt: "2022-08-09T17:00:14.213847+00:00",
    publishedBy: {
      __typename: "User",
      id: "cl08dlo5i3jl101z33sjudks3",
    },
    scheduledIn: [],
    stage: "PUBLISHED",
    subject: "NOVO email",
    updatedAt: "2022-08-09T17:00:13.64896+00:00",
    updatedBy: {
      __typename: "User",
      id: "cl08dlo5i3jl101z33sjudks3",
    },
  },
};

const Page: NextPage = () => {
  const htmlConverted = astToHtmlString({
    content: JSON.data.content.json as RichTextProps["content"],
    references: JSON.data.content.references,
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
        `<h1 style="margin-bottom: 1.5rem">${children}</h1>`,
      h2: ({ children }) =>
        `<h2 style="margin-bottom: 1.25rem">${children}</h2>`,
      h3: ({ children }) => `<h3 style="margin-bottom: 1rem">${children}</h3>`,
      h4: ({ children }) =>
        `<h4 style="margin-bottom: 0.75rem">${children}</h4>`,
      h5: ({ children }) =>
        `<h5 style="margin-bottom: 0.5rem">${children}</h5>`,
      h6: ({ children }) =>
        `<h6 style="margin-bottom: 0.25rem">${children}</h6>`,
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
  });

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

        ${htmlConverted}

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

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
    </>
  );
};

export default Page;
