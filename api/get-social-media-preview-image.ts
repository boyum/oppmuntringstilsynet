import puppeteer from "puppeteer";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function getSocialMediaPreviewImage(
  request: VercelRequest,
  response: VercelResponse,
): Promise<void> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set viewport to preferred Open Graph image size
  await page.setViewport({
    width: 1200,
    height: 627,
    deviceScaleFactor: 1,
  });

  await page.goto(
    request.url?.replace(
      "api/get-social-media-preview-image",
      "social-media-preview",
    ) ?? "/social-media-preview",
  );

  const file = await page.screenshot({
    type: "png",
  });

  await browser.close();

  response.statusCode = 200;
  response.setHeader("Content-Type", "image/png");

  response.end(file);
}
