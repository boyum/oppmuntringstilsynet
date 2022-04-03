import type { VercelRequest, VercelResponse } from "@vercel/node";
import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer";
import puppeteerCore from "puppeteer-core";

function getExecutablePath(): string {
  let exePath = "";
  switch (process.platform) {
    case "win32":
      exePath =
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
      break;
    case "linux":
      exePath = "/usr/bin/google-chrome";
      break;
    default:
      exePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
      break;
  }

  return exePath;
}

async function getOptions(
  isDev: boolean,
): Promise<
  puppeteerCore.LaunchOptions &
    puppeteerCore.BrowserLaunchArgumentOptions &
    puppeteerCore.BrowserConnectOptions
> {
  let options;
  if (isDev) {
    options = {
      args: [],
      executablePath: getExecutablePath(),
      headless: true,
    };
  } else {
    options = {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    };
  }
  return options;
}

async function getSocialMediaPreviewImage(
  request: VercelRequest,
  response: VercelResponse,
): Promise<void> {
  const isDev = request.query["isDev"] === "true";
  let browser;
  if (isDev) {
    browser = await puppeteer.launch();
  } else {
    const options = await getOptions(isDev);

    browser = await puppeteerCore.launch(options);
  }
  const page = await browser.newPage();

  // Set viewport to preferred Open Graph image size
  await page.setViewport({
    width: 1200,
    height: 627,
    deviceScaleFactor: 1,
  });

  const protocols = request.headers["x-forwarded-proto"] ?? "";
  const protocol = Array.isArray(protocols) ? protocols[0] : protocols;

  const hosts = request.headers["x-forwarded-host"] ?? "";
  const host = Array.isArray(hosts) ? hosts[0] : hosts;

  const uri =
    request.url?.replace(
      "api/get-social-media-preview-image",
      "social-media-preview",
    ) ?? "/social-media-preview";

  const url = `${protocol}://${host}${uri}`;
  console.info("Screenshot url:", url);

  await page.goto(url);

  const file = await page.screenshot({
    type: "png",
  });

  await browser.close();

  response.statusCode = 200;
  response.setHeader("Content-Type", "image/png");

  response.end(file);
}

// eslint-disable-next-line import/no-default-export
export default getSocialMediaPreviewImage;
