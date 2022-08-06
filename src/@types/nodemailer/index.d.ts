import "nodemailer/lib/mailer";

declare module "nodemailer/lib/mailer" {
  declare interface Options {
    markdown: string | Buffer | Readable | AttachmentLike | undefined;
  }
}
