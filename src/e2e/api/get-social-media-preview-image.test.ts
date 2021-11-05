// import dotenv from "dotenv";
import { test, expect } from "@playwright/test";
import getSocialMediaPreviewImage from "../../../api/get-social-media-preview-image";

// dotenv.config();

// const localUrl = "http://localhost:3000";
// const deployUrl = process.env.DEPLOY_URL ?? localUrl;
// const endpointUrl = `${deployUrl}/api/get-social-media-preview-image`;

test.describe(getSocialMediaPreviewImage.name, () => {
  test("should contain at least one test", () => {
    /* This is used to silence jest */
    expect(true).toBe(true);
  });
  //   let page: Page;

  //   beforeEach(async () => {
  //     page = await browser.newPage();
  //   });

  //   afterEach(async () => {
  //     await page.close();
  //   });

  //   it("should return an image when no encoded message is provided", async () => {
  //     const isLocal = localUrl === deployUrl;

  //     const result = await page.goto(
  //       `${endpointUrl}?isDev=${isLocal.toString()}`,
  //     );

  //     const pageDoesNotExist = result.status() === 404;
  //     if (pageDoesNotExist && isLocal) {
  //       console.error(
  //         `Page '${endpointUrl}' does not exist.\nDid you start the vercel dev server? If not, run \`npm run dev:api\` and try again.`,
  //       );
  //     }

  //     expect(result.status()).toBe(200);
  //     expect(result.headers()["content-type"]).toBe("image/png");
  //   });

  //   it("should return an image when an encoded message is provided", async () => {
  //     const isLocal = localUrl === deployUrl;
  //     const url = `${endpointUrl}/?isDev=${isLocal.toString()}&m=N4IgxgFgpmDWDOIBcBtALgJwK5QDSZ32ygF1cQATAQzSmUprvIFsp54qBzOpEV9rkxAA7Kq3qjx5ADZVhnLIPoA5APYZ4sAEKrYzKtJDk00VsrE8QABwwBLCnQC%2BQA`;

  //     const result = await page.goto(url);

  //     const pageDoesNotExist = result.status() === 404;
  //     if (pageDoesNotExist && isLocal) {
  //       console.error(
  //         `Page '${endpointUrl}' does not exist.
  //         Did you start the vercel dev server? If not, run \`npm run dev:api\` and try again.`,
  //       );
  //     }

  //     expect(result.status()).toBe(200);
  //     expect(result.headers()["content-type"]).toBe("image/png");
  //   });
});
