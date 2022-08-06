import { Options as Original } from "nodemailer/lib/mailer";

declare module "nodemailer/lib/mailer" {
  export interface Options {
    markdown: string | Buffer | Readable | AttachmentLike | undefined;
  }
}
