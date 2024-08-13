import { Buffer } from "buffer";
import * as OTPAuth from "otpauth";
import { MigrationPayload, type IOtpParameters } from "./googleauth.payload";
import Pbf from "pbf";
import jsqr from "jsqr";
import type { OTPAccount } from "@/types";
import { VisibleError } from "@/errors/visible";
import { mergeAccount } from "./account";

export function generate(account: OTPAccount): string {
  const totp = new OTPAuth.TOTP({
    issuer: account.issuer,
    label: account.label,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(account.secret),
  });

  return totp.generate();
}

export async function imageDataFromURL(url: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(imageDataFromElement(img));
    img.onerror = () => reject(new Error("Invalid image URL"));
    img.src = url;
  });
}

export async function getDataURL(url: string): Promise<string> {
  const data = await chrome.runtime.sendMessage({
    type: "get-data-url",
    data: url,
  });

  return data.url;
}

export function imageDataFromElement(img: HTMLImageElement): ImageData {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Invalid canvas context");
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  ctx.save();

  return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
}

export async function scanQRCode(image: ImageData): Promise<OTPAccount[]> {
  const result = jsqr(image.data, image.width, image.height);
  if (!result) throw new VisibleError("Invalid QR Code");
  if (result.data.startsWith("otpauth://")) {
    return parseOTPURL(result.data);
  } else if (result.data.startsWith("otpauth-migration://")) {
    return parseMigrationURL(result.data);
  } else throw new VisibleError("Invalid QR Code");
}

export function parseOTPURL(uri: string): OTPAccount[] {
  const totp = OTPAuth.URI.parse(uri);
  const account = mergeAccount({
    algorithm: totp.algorithm as OTPAccount["algorithm"],
    digits: totp.digits,
    issuer: totp.issuer,
    period: "period" in totp ? totp.period : 30,
    label: totp.label,
    secret: totp.secret.base32,
  });

  return [account];
}

export function parseMigrationURL(uri: string): OTPAccount[] {
  const accounts = [] as OTPAccount[];
  const url = new URL(uri);
  const data = url.searchParams.get("data");
  if (!data) throw new Error("Invalid URL");
  const buffer = Buffer.from(decodeURIComponent(data), "base64");

  const pbf = new Pbf(buffer);
  const json = MigrationPayload.read(pbf);
  const totps = json.parameters.map((account: any) => {
    const secretHex = Buffer.from(account.secret, "base64").toString("hex");
    account.secret = OTPAuth.Secret.fromHex(secretHex).base32;
    account.algorithm = MigrationPayload.Algorithms[account.algorithm];
    return account;
  });

  totps.forEach((otp: any) => {
    const account = mergeAccount({
      algorithm: otp.algorithm,
      issuer: otp.issuer,
      label: otp.name,
      secret: otp.secret,
      period: 30,
      digits: 6,
    });

    accounts.push(account);
  });

  return accounts;
}

export function generateMigrationURL(accounts: OTPAccount[]): string {
  const pbf = new Pbf();
  const parameters: IOtpParameters[] = [];

  accounts.forEach((account) => {
    const parameter = {} as IOtpParameters;
    parameter.algorithm = MigrationPayload.Algorithms.indexOf(account.algorithm);
    parameter.issuer = account.issuer;
    parameter.name = account.label;
    parameter.secret = Buffer.from(OTPAuth.Secret.fromBase32(account.secret).hex, "hex");
    parameter.type = MigrationPayload.OtpType.OTP_TOTP.value;
    parameter.digits = 1;
    parameter.counter = 0;

    parameters.push(parameter);
  });

  MigrationPayload.write(
    {
      parameters,
      version: 1,
      batch_size: 1,
      batch_index: 0,
      batch_id: Math.floor(Date.now() / 1000),
    },
    pbf
  );

  const data = pbf.finish();
  const url = new URL("otpauth-migration://offline");
  url.searchParams.set("data", Buffer.from(data).toString("base64"));
  return url.toString();
}
