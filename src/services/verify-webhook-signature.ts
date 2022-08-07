import { createHmac } from "crypto";

interface Params {
  body: any;
  signature: string;
  secret: string;
  rawPayload?: any;
}

export const verifyWebhookSignature = async ({
  body,
  signature,
  secret,
  rawPayload,
}: Params): Promise<boolean> => {
  if (!signature || typeof signature !== "string") return false;

  const [rawSign, rawEnv, rawTimestamp] = signature.split(", ");

  const sign = rawSign.replace("sign=", "");
  const EnvironmentName = rawEnv.replace("env=", "");
  const Timestamp = parseInt(rawTimestamp.replace("t=", ""));

  const payload = await JSON.stringify({
    Body: rawPayload || JSON.stringify(body),
    EnvironmentName,
    TimeStamp: Timestamp,
  });

  const hash = await createHmac("sha256", secret)
    .update(payload)
    .digest("base64");

  return sign === hash;
};
