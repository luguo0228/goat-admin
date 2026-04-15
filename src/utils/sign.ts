import md5 from "md5";
import JSEncrypt from "jsencrypt";
import jsrsasign from "jsrsasign";
import sha256 from "js-sha256";
import qs from "qs";
// import { AxiosRequestConfig } from 'axios'
const APIKEY = "efce07ca366111f1ad7d0242ac110004";
const APISECRET = "e900529b366111f1ad7d0242ac110004";
const VERSION = "1.0.0";
// rsa 公钥
const RSAPUBLICKEY =
  "-----BEGIN PUBLIC KEY----- MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDiJtEjUidOigya/AC6o4VZJ3qpx0mrgCxlfXPW6KCKFlwR2j1gxqEJB2Blnu5Hm9BtvlLZWt2Ej6DgVLSuZ3c0L63YXkGnawEEan27bFcTDCjP94va316JQEeYFMtbMc7+9tIEFMbM3v9F3q6RhmYTQN3OaYBh8TggTADN4GwoYwIDAQAB -----END PUBLIC KEY-----";
// rsa 私钥
const RSAPRIVATEKEY =
  "-----BEGIN PRIVATE KEY-----\nMIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAI1qCkinseK7Snz5TRvwidFcfywJiGlwRGtPNzCTHvKjpDhR8k1h1On6Xp27dM2ZeTuRambSmNRu4o2zXY+uYkK7iXD11+ysu6uj8A+in4B5AIePXL9r65VibQ8eMpMD2lY5bQQolbxnW0JbZvFqUhjWYGFTi0Xcrtp20k2dIPBJAgMBAAECgYB9Vi0DNE5/rIxatANZ7hnYi+jTOSfEfBLIIY/C58KYP92/ZTIiz8EMGDJgDtN5nrtKxpnNxH5cWmNGQGF+hYrkVCaVwccJcokmNkoLFLaSwKLrk2woOT0rWoq2UvFLSszaZGNLkcz49vYdiTuM9x+S3P2xeOJWsTBLMCz9CxQymQJBAM73z7vjRSQ8yy1tOox8nVRxdT3JYWlohLvLBv0SenglN0OlyuwAOvcqROYzAQTxDCrF6bUig9PdfbHwFaNbwbMCQQCu6oZL48TsM+o0mFDtVd0tygNnKeBsWb1vMHh0TQN8yKzTAZ60XLFT6x+/yVpg+C7piB9JNXxblzGX8AsTADATAkA+QRoyOOV2RfcTffSLh3xHhy0t3aI4c6DhX+uFOgaulvstlPQZ0uPprsQ0vgjDdMIlJ4zp2CzxEIGbgUzw60uzAkB2V44NAklVVbp7YyI9sP434Jl0zsxcAks8Uxrr9L8LSepDyLDLbns7P7T3WQ+g08lJjyM7sMg2X5DaLzoO3O2pAkEAnZM8/PckTa8FP+PeAICIQWZ+43Z7hLYDgdCNx7e3szugbSUdPDsnXpqc3kZzlloOI5vkcB270UtZIBH6sqqtLQ==\n-----END PRIVATE KEY-----";
export default function apiSign(config:any) {
  try {
    const timestamp = new Date().getTime();
    const params = paramsParse(qs.parse(config.data));
    const apiNonce = createApiNonce();
    const fullPath = `${config.url}`.replace(new RegExp(`/basic-api`), "");
    config.headers["X-Api-Version"] = VERSION;
    config.headers["X-Api-Key"] = APIKEY;
    config.headers["X-Api-Timestamp"] = timestamp;
    config.headers["X-Api-Nonce"] = apiNonce;
    config.headers["X-Api-Signature-Params"] = params.keys.join(",");
    config.headers["X-Api-Signature-Method"] = "HmacSHA256";
    config.headers["X-Api-Signature"] = createSignature(
      params.urlParams,
      apiNonce,
      fullPath,
    );
    config.headers["X-Api-Digest"] = createDigest(params.urlParams);
    config.headers["X-Api-Terminal"] = "MANAGE";
  } catch (error) {
    console.log(error);
    return config;
  }
}

const createApiNonce = (function () {
  let seqNum = 0;
  return function () {
    const timestamp = new Date().getTime();
    return md5(APIKEY + timestamp + seqNum++);
  };
})();

function createSignature(
  urlParams: string,
  apiNonce: string,
  fullPath: string,
) {
  return encodeURIComponent(
    rsaNcrypt(
      (sha256 as any).hmac(
        APISECRET,
        `${urlParams}${VERSION}${apiNonce}${fullPath}`,
      ),
    ),
  );
}
function createDigest(urlParams: string) {
  return encodeURIComponent(rsaSign(`${urlParams}`));
}
// RSA加密
function rsaNcrypt(str: string) {
  const encryptStr = new JSEncrypt();
  encryptStr.setPublicKey(RSAPUBLICKEY);
  return encryptStr.encrypt(str);
}
// RSA签名
function rsaSign(str: string) {
  const signature = new jsrsasign.KJUR.crypto.Signature({ alg: "MD5withRSA" });
  signature.init(RSAPRIVATEKEY);
  signature.updateString(str);
  // 签名返回结果是16进制字符串,注意转码
  const res = signature.sign();
  return jsrsasign.hextob64(res);
}

function paramsParse(params: any) {
  params = sortAscii(params);
  const keys = Object.keys(params);
  // const encode = false; //中文不转码
  const urlParams = qs.stringify(params, { encode: false });
  return {
    keys,
    urlParams,
  };
}

/** 按ascii码从小到大排序
 * @param obj
 * @returns {object}
 */
function sortAscii(obj: any) {
  const arr: any[] = [];
  let num = 0;
  for (const i in obj) {
    arr[num] = i;
    num++;
  }
  const sortArr = arr.sort();
  const sortObj: any = {}; // 完成排序值
  for (const i in sortArr) {
    sortObj[sortArr[i]] = obj[sortArr[i]];
  }
  return sortObj;
}
