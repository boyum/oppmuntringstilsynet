import { checkA11y, injectAxe } from "axe-playwright";
import dotenv from "dotenv";
import { test, expect, BrowserContext } from "@playwright/test";
import languages from "../../models/languages";
import { themes } from "../../types/Themes";
import { getPreferredLanguage } from "../../utils/language-utils";
import { getTranslations } from "../../utils/translations-utils";

dotenv.config();

const deployUrl = process.env.DEPLOY_URL ?? "http://localhost:3000";

type BrowserName = "chromium" | "firefox" | "webkit";
const grantReadPermission = async (
  browserName: BrowserName,
  context: BrowserContext,
): Promise<void> => {
  const isChromium = browserName === "chromium";
  if (isChromium) {
    await context.grantPermissions(["clipboard-read"]);
  }
};

test.describe("Home", () => {
  // test.beforeAll(async ({ page }) => {
  //   await injectAxe(page);
  // });

  test.beforeEach(async ({ page }) => {
    await page.goto(deployUrl);
    await page.evaluate(() => localStorage.clear());
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  Object.entries(languages).forEach(([languageName, languageRecord]) => {
    test(`should be titled ${languageRecord.translations.pageTitle} when the Accept-Language is ${languageName}`, async ({
      page,
    }) => {
      await page.setExtraHTTPHeaders({
        "Accept-Language": languageRecord.codes[0],
      });
      await page.goto(deployUrl);

      await expect(page.title()).resolves.toMatch(
        languageRecord.translations.pageTitle,
      );
    });
  });

  test(`should have the default language's title if the Accept-Language is not supported`, async ({
    page,
  }) => {
    const defaultLanguage = getPreferredLanguage(["unknown", "language"]);
    const translations = getTranslations(defaultLanguage);

    await expect(page.title()).resolves.toMatch(translations.pageTitle);
  });

  test("should copy a link to the card", async ({
    page,
    browser,
    browserName,
  }) => {
    const context = browser.contexts()[0];
    grantReadPermission(browserName, context);

    const isWebkit = browserName === "webkit";
    if (isWebkit) {
      return;
    }

    await page.type("#date-field", "date");
    await page.type("#message-body-field", "message");
    await page.click(`[for="checkbox-0"]`);
    await page.click(`[for="checkbox-1"]`);
    await page.click(`[for="checkbox-2"]`);
    await page.type("#name-field", "name");

    await page.click("#copy-button");

    const copiedText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(copiedText).toBe(
      `${deployUrl}/?m=N4IgxgFgpmDWDOIBcBtALgJwK5QDSZ32ygF1cQATAQzSmUprvIFsp54qBzOpEV9rkxAA7Kq3qjx5ADZVhnLIPoA5APYZ4sAEKrYzKtJDk00VsrE8QABwwBLCnQC%2BQA`,
    );
  });

  test("should work with taps as well", async ({
    page,
    browser,
    browserName,
  }) => {
    const context = browser.contexts()[0];
    grantReadPermission(browserName, context);

    const isWebkit = browserName === "webkit";
    if (isWebkit) {
      return;
    }

    await page.type("#date-field", "date");
    await page.type("#message-body-field", "message");
    await page.tap(`[for="checkbox-0"]`);
    await page.tap(`[for="checkbox-1"]`);
    await page.tap(`[for="checkbox-2"]`);
    await page.type("#name-field", "name");

    await page.tap("#copy-button");

    const copiedText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(copiedText).toBe(
      `${deployUrl}/?m=N4IgxgFgpmDWDOIBcBtALgJwK5QDSZ32ygF1cQATAQzSmUprvIFsp54qBzOpEV9rkxAA7Kq3qjx5ADZVhnLIPoA5APYZ4sAEKrYzKtJDk00VsrE8QABwwBLCnQC%2BQA`,
    );
  });

  test("should open a new card with the parsed message's parameters", async ({
    page,
  }) => {
    await page.goto(
      `${deployUrl}/?m=N4IgxgFgpmDWDOIBcBtALgJwK5QDSZ32ygF1cQATAQzSmUprvIFsp54qBzOpEV9rkxAA7Kq3qjx5ADZVhnLIPoA5APYZ4sAEKrYzKtJDk00VsrE8QABwwBLCnQC%2BQA`,
    );

    const dateText = await page.evaluate(
      () => document.querySelector<HTMLInputElement>("#date-field")?.value,
    );
    const messageText = await page.evaluate(
      () =>
        document.querySelector<HTMLTextAreaElement>("#message-body-field")
          ?.value,
    );
    const checkbox0Value = await page.evaluate(
      () => document.querySelector<HTMLInputElement>("#checkbox-0")?.value,
    );
    const checkbox1Value = await page.evaluate(
      () => document.querySelector<HTMLInputElement>("#checkbox-1")?.value,
    );
    const checkbox2Value = await page.evaluate(
      () => document.querySelector<HTMLInputElement>("#checkbox-2")?.value,
    );
    const nameText = await page.evaluate(
      () => document.querySelector<HTMLInputElement>("#name-field")?.value,
    );

    expect(dateText).toBe("date");
    expect(messageText).toBe("message");
    expect(checkbox0Value).toBe("true");
    expect(checkbox1Value).toBe("true");
    expect(checkbox2Value).toBe("true");
    expect(nameText).toBe("name");
  });

  test("should use the current page theme as the theme of the card", async ({
    page,
    browser,
    browserName,
  }) => {
    const context = browser.contexts()[0];
    grantReadPermission(browserName, context);

    const isWebkit = browserName === "webkit";
    if (isWebkit) {
      return;
    }

    const incognitoContext = await browser.newContext();
    const incognitoPage = await incognitoContext.newPage();

    const expectedTheme = "winter";

    await page.click("#theme-picker-button");
    await page.click(`#theme-${expectedTheme}`);

    await page.click("#copy-button");

    const cardUrl = await page.evaluate(() => navigator.clipboard.readText());

    // Use an incognito page to avoid using localstorage
    await incognitoPage.goto(cardUrl);

    const actualTheme = await incognitoPage.evaluate(
      () => document.body.dataset.theme,
    );

    expect(actualTheme).toBe(expectedTheme);

    context.close();
  });

  test("should use the current page theme as the theme of the card even if the card is reset", async ({
    page,
    browser,
    browserName,
  }) => {
    const context = browser.contexts()[0];
    grantReadPermission(browserName, context);

    const isWebkit = browserName === "webkit";
    if (isWebkit) {
      return;
    }

    const incognitoContext = await browser.newContext();
    const incognitoPage = await incognitoContext.newPage();

    const expectedTheme = "winter";

    await page.click("#theme-picker-button");
    await page.click(`#theme-${expectedTheme}`);

    await page.click("#reset-button");

    await page.click("#copy-button");

    const cardUrl = await page.evaluate(() => navigator.clipboard.readText());

    // Use an incognito page to avoid using localstorage
    await incognitoPage.goto(cardUrl);

    const actualTheme = await incognitoPage.evaluate(
      () => document.body.dataset.theme,
    );

    expect(actualTheme).toBe(expectedTheme);

    incognitoContext.close();
  });

  test("should use the current page theme as the theme of the card even if the page is reloaded", async ({
    page,
    browser,
    browserName,
  }) => {
    const context = browser.contexts()[0];
    grantReadPermission(browserName, context);

    const isWebkit = browserName === "webkit";
    if (isWebkit) {
      return;
    }

    const incognitoContext = await browser.newContext();
    const incognitoPage = await incognitoContext.newPage();

    const expectedTheme = "winter";

    await page.click("#theme-picker-button");
    await page.click(`#theme-${expectedTheme}`);

    await page.reload();

    await page.click("#copy-button");

    const cardUrl = await page.evaluate(() => navigator.clipboard.readText());

    // Use an incognito page to avoid using localstorage
    await incognitoPage.goto(cardUrl);

    const actualTheme = await incognitoPage.evaluate(
      () => document.body.dataset.theme,
    );

    expect(actualTheme).toBe(expectedTheme);

    incognitoContext.close();
  });

  // themes.forEach(({ name: themeName }) => {
  //   test(`should not break any accessibility tests if using ${themeName} theme`, async ({
  //     page,
  //   }) => {
  //     // await page.setBypassCSP(true);
  //     await page.click("#theme-picker-button");
  //     await page.click(`#theme-${themeName}`);

  //     await checkA11y(page, undefined);
  //     // const axePuppeteer = new AxePuppeteer(page);

  //     // // The message body field uses a background image
  //     // // to create the lines. This makes Axe trigger on
  //     // // a false positive. The styles are tested in the
  //     // // other text fields.
  //     // axePuppeteer.exclude("#message-body-field");

  //     // // Button styles are tested on the theme picker
  //     // // button. The form buttons are excluded because Axe
  //     // // triggers on a false positive because of pseudo
  //     // // elements.
  //     // axePuppeteer.exclude("#buttons");

  //     // const globalBackgroundImage = await page.evaluate(() =>
  //     //   window
  //     //     .getComputedStyle(document.body)
  //     //     .getPropertyValue("--global-background-image")
  //     //     .trim(),
  //     // );
  //     // const themeSetsGlobalBackgroundImage = globalBackgroundImage !== "none";
  //     // if (themeSetsGlobalBackgroundImage) {
  //     //   // Axe cannot determine whether or not the footer text
  //     //   // has the correct syntax if its on top of an image.
  //     //   // In that case, we'll have to check manually.
  //     //   axePuppeteer.exclude("footer");
  //     // }

  //     // const { incomplete } = await axePuppeteer.analyze();

  //     // expect(incomplete).toHaveLength(0);
  //   });
  // });

  test("should mark all fields in an opened card as readonly", async ({
    page,
    browser,
    browserName,
  }) => {
    const context = browser.contexts()[0];
    grantReadPermission(browserName, context);

    const isWebkit = browserName === "webkit";
    if (isWebkit) {
      return;
    }

    await page.type("#date-field", "date");
    await page.type("#message-body-field", "message");
    await page.click(`[for="checkbox-0"]`);
    await page.click(`[for="checkbox-1"]`);
    await page.click(`[for="checkbox-2"]`);
    await page.type("#name-field", "name");

    await page.click("#copy-button");

    const copiedUrl = await page.evaluate(() => navigator.clipboard.readText());

    await page.goto(copiedUrl);

    page.evaluate(() => {
      const form = document.querySelector("form");

      if (!form) {
        throw new Error("Form did not render");
      }

      const disabledFields = form.querySelectorAll<
        HTMLInputElement | HTMLTextAreaElement
      >("input, textarea");

      disabledFields.forEach(element => {
        const isDisabled = element.disabled;

        expect(isDisabled).toBe(true);
      });
    });
  });

  test("should mark not mark any fields in an empty card as readonly", async ({
    page,
  }) => {
    page.evaluate(() => {
      const form = document.querySelector("form");

      if (!form) {
        throw new Error("Form did not render");
      }

      const disabledFields = form.querySelectorAll<
        HTMLInputElement | HTMLTextAreaElement
      >("input, textarea");

      disabledFields.forEach(element => {
        const isDisabled = element.disabled;

        expect(isDisabled).toBe(true);
      });
    });
  });
});
