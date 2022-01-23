import { AxePuppeteer } from "@axe-core/puppeteer";
import dotenv from "dotenv";
import type { Page } from "puppeteer";
import puppeteer from "puppeteer";
import { languages } from "../../models/languages";
import { themes } from "../../types/Themes";
import { getPreferredLanguage } from "../../utils/language-utils";
import { getTranslations } from "../../utils/translations-utils";

dotenv.config();

const deployUrl = process.env.DEPLOY_URL ?? "http://localhost:3000";

describe("Home", () => {
  let page: Page;

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto(deployUrl);
    await page.evaluate(() => localStorage.clear());
  });

  afterEach(async () => {
    await page.close();
  });

  Object.entries(languages).forEach(([languageName, languageRecord]) => {
    it(`should be titled ${languageRecord.translations.pageTitle} when the Accept-Language is ${languageName}`, async () => {
      await page.setExtraHTTPHeaders({
        "Accept-Language": languageRecord.codes[0],
      });
      await page.goto(deployUrl);

      await expect(page.title()).resolves.toMatch(
        languageRecord.translations.pageTitle,
      );
    });
  });

  it(`should have the default language's title if the Accept-Language is not supported`, async () => {
    const defaultLanguage = getPreferredLanguage(["unknown", "language"]);
    const translations = getTranslations(defaultLanguage);

    await expect(page.title()).resolves.toMatch(translations.pageTitle);
  });

  it("should copy a link to the card", async () => {
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(deployUrl, ["clipboard-read"]);

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

  it("should work with taps as well", async () => {
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(deployUrl, ["clipboard-read"]);

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

  it("should open a new card with the parsed message's parameters", async () => {
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

  // it("should use the current page theme as the theme of the card", async () => {
  //   const context = browser.defaultBrowserContext();
  //   await context.overridePermissions(deployUrl, ["clipboard-read"]);

  //   const incognitoBrowser = await puppeteer.launch({
  //     args: ["--incognito"],
  //   });
  //   const incognitoPage = await incognitoBrowser.newPage();

  //   const expectedTheme = "winter";

  //   await page.click("#theme-picker-button");
  //   await page.click(`#theme-${expectedTheme}`);

  //   await page.click("#copy-button");

  //   const cardUrl = await page.evaluate(() => navigator.clipboard.readText());

  //   // Use an incognito page to avoid using localstorage
  //   await incognitoPage.goto(cardUrl);

  //   const actualTheme = await incognitoPage.evaluate(
  //     () => document.body.dataset.theme,
  //   );

  //   expect(actualTheme).toBe(expectedTheme);

  //   incognitoBrowser.close();
  // });

  // it("should use the current page theme as the theme of the card even if the card is reset", async () => {
  //   const context = browser.defaultBrowserContext();
  //   await context.overridePermissions(deployUrl, ["clipboard-read"]);

  //   const incognitoBrowser = await puppeteer.launch({
  //     args: ["--incognito"],
  //   });
  //   const incognitoPage = await incognitoBrowser.newPage();

  //   const expectedTheme = "winter";

  //   await page.click("#theme-picker-button");
  //   await page.click(`#theme-${expectedTheme}`);

  //   await page.click("#reset-button");

  //   await page.click("#copy-button");

  //   const cardUrl = await page.evaluate(() => navigator.clipboard.readText());

  //   // Use an incognito page to avoid using localstorage
  //   await incognitoPage.goto(cardUrl);

  //   const actualTheme = await incognitoPage.evaluate(
  //     () => document.body.dataset.theme,
  //   );

  //   expect(actualTheme).toBe(expectedTheme);

  //   incognitoBrowser.close();
  // });

  // it("should use the current page theme as the theme of the card even if the page is reloaded", async () => {
  //   const context = browser.defaultBrowserContext();
  //   await context.overridePermissions(deployUrl, ["clipboard-read"]);

  //   const incognitoBrowser = await puppeteer.launch({
  //     args: ["--incognito"],
  //   });
  //   const incognitoPage = await incognitoBrowser.newPage();

  //   const expectedTheme = "winter";

  //   await page.click("#theme-picker-button");
  //   await page.click(`#theme-${expectedTheme}`);

  //   await page.reload();

  //   await page.click("#copy-button");

  //   const cardUrl = await page.evaluate(() => navigator.clipboard.readText());

  //   // Use an incognito page to avoid using localstorage
  //   await incognitoPage.goto(cardUrl);

  //   const actualTheme = await incognitoPage.evaluate(
  //     () => document.body.dataset.theme,
  //   );

  //   expect(actualTheme).toBe(expectedTheme);

  //   incognitoBrowser.close();
  // });

  themes.forEach(({ name: themeName }) => {
    it(`should not break any accessibility tests if using ${themeName} theme`, async () => {
      await page.setBypassCSP(true);
      await page.click("#theme-picker-button");
      await page.click(`#theme-${themeName}`);

      const axePuppeteer = new AxePuppeteer(page);

      // The message body field uses a background image
      // to create the lines. This makes Axe trigger on
      // a false positive. The styles are tested in the
      // other text fields.
      axePuppeteer.exclude("#message-body-field");

      // Button styles are tested on the theme picker
      // button. The form buttons are excluded because Axe
      // triggers on a false positive because of pseudo
      // elements.
      axePuppeteer.exclude("#buttons");

      const globalBackgroundImage = await page.evaluate(() =>
        window
          .getComputedStyle(document.body)
          .getPropertyValue("--global-background-image")
          .trim(),
      );
      const themeSetsGlobalBackgroundImage = globalBackgroundImage !== "none";
      if (themeSetsGlobalBackgroundImage) {
        // Axe cannot determine whether or not the footer text
        // has the correct syntax if its on top of an image.
        // In that case, we'll have to check manually.
        axePuppeteer.exclude("footer");
      }

      const { incomplete } = await axePuppeteer.analyze();

      expect(incomplete).toHaveLength(0);
    });
  });

  it("should mark all fields in an opened card as readonly", async () => {
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(deployUrl, ["clipboard-read"]);

    await page.type("#date-field", "date");
    await page.type("#message-body-field", "message");
    await page.click(`[for="checkbox-0"]`);
    await page.click(`[for="checkbox-1"]`);
    await page.click(`[for="checkbox-2"]`);
    await page.type("#name-field", "name");

    await page.click("#copy-button");

    const copiedUrl = await page.evaluate(() => navigator.clipboard.readText());

    await page.goto(copiedUrl);

    const form = await page.$("form");

    if (!form) {
      throw new Error("Form did not render");
    }

    const disabledFields = await form.$$("input, textarea");
    await Promise.all(
      disabledFields.map(async element => {
        // If the `_remoteObject` property is ever changed or removed,
        // this can also be done by running everything inside `page.evaluate`

        // eslint-disable-next-line no-underscore-dangle
        const isDisabled = (await element.getProperty("disabled"))
          ?._remoteObject.value;

        expect(isDisabled).toBe(true);
      }),
    );
  });

  it("should mark not mark any fields in an empty card as readonly", async () => {
    const form = await page.$("form");

    if (!form) {
      throw new Error("Form did not render");
    }

    const disabledFields = await form.$$("input, textarea");
    await Promise.all(
      disabledFields.map(async element => {
        // eslint-disable-next-line no-underscore-dangle
        const isDisabled = (await element.getProperty("disabled"))
          ?._remoteObject.value;

        expect(isDisabled).toBe(false);
      }),
    );
  });
});
