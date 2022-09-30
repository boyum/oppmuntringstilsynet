import type { VercelRequest, VercelResponse } from "@vercel/node";
import chromeAwsLambda from "@sparticuz/chrome-aws-lambda";
import type {
  LaunchOptions,
  BrowserLaunchArgumentOptions,
  BrowserConnectOptions,
} from "puppeteer-core";
import { launch as launchCore } from "puppeteer-core";
// import { launch as launchPuppeteer } from "puppeteer";

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
  LaunchOptions & BrowserLaunchArgumentOptions & BrowserConnectOptions
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
      args: chromeAwsLambda.args,
      executablePath: await chromeAwsLambda.executablePath,
      headless: chromeAwsLambda.headless,
    };
  }
  return options;
}

async function getSocialMediaPreviewImage(
  request: VercelRequest,
  response: VercelResponse,
): Promise<void> {
  // const isDev = request.query["isDev"] === "true";
  // let browser;
  // if (isDev) {
  //   browser = await launchPuppeteer();
  // } else {
  const options = await getOptions(false);
  const browser = await launchCore(options);
  // }
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
