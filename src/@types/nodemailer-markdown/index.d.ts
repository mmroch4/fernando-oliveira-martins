declare module "nodemailer-markdown" {
  interface Options {
    useEmbeddedImages: boolean;
    baseUrl: string;
    breaks: boolean;
    gfm: boolean;
    headerIds: boolean;
    headerPrefix: string;
    highlight: Function;
    langPrefix: string;
    mangle: boolean;
    pedantic: boolean;
    renderer: object;
    sanitize: boolean;
    sanitizer: Function;
    silent: boolean;
    smartLists: boolean;
    smartypants: boolean;
    tokenizer: object;
    walkTokens: Function;
    xhtml: boolean;
  }

  export function markdown(options?: Options);
}
