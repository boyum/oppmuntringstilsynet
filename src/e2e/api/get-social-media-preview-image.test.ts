// eslint-disable-next-line import/no-extraneous-dependencies
import dotenv from "dotenv";
// eslint-disable-next-line import/no-extraneous-dependencies
import getSocialMediaPreviewImage from "../../../api/get-social-media-preview-image";

dotenv.config();

const localUrl = "http://localhost:3000";
const deployUrl = process.env.DEPLOY_URL ?? localUrl;
const endpointUrl = `${deployUrl}/api/get-social-media-preview-image`;

describe(getSocialMediaPreviewImage.name, () => {
  it("should return an image when no encoded message is provided", async () => {
    const isLocal = localUrl === deployUrl;

    const result = await page.goto(`${endpointUrl}?isDev=${isLocal.toString()}`);

    const pageDoesNotExist = result.status() === 404;
    if (pageDoesNotExist && isLocal) {
      throw new Error(
        `Page '${endpointUrl}' does not exist.
        Did you start the vercel dev server? If not, run \`npm run dev:api\` and try again.`,
      );
    }

    expect(result.status()).toBe(200);
    expect(result.headers()["content-type"]).toBe("image/png");
  });

  it("should return an image when an encoded message is provided", async () => {
    const isLocal = localUrl === deployUrl;
    const url = `${endpointUrl}/?isDev=${isLocal.toString()}&m=N4IgxgFgpmDWDOIBcBtALgJwK5QDSZ32ygF1cQATAQzSmUprvIFsp54qBzOpEV9rkxAA7Kq3qjx5ADZVhnLIPoA5APYZ4sAEKrYzKtJDk00VsrE8QABwwBLCnQC%2BQA`;

    const result = await page.goto(url);

    const pageDoesNotExist = result.status() === 404;
    if (pageDoesNotExist && isLocal) {
      throw new Error(
        `Page '${endpointUrl}' does not exist.
        Did you start the vercel dev server? If not, run \`npm run dev:api\` and try again.`,
      );
    }

    expect(result.status()).toBe(200);
    expect(result.headers()["content-type"]).toBe("image/png");
  });
});
