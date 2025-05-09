import { AxePuppeteer } from "@axe-core/puppeteer";
import type { Page } from "puppeteer";
import { languages } from "../../models/languages";
import type { LocaleCode } from "../../types/LocaleCode";
import { themes } from "../../types/Themes";
import { TranslationsEn } from "../../types/Translations.en";
import { getFirstAcceptedLanguage } from "../../utils/language-utils";
import { getTranslations } from "../../utils/translations-utils";
import { LATEST_QUERY_PARAM_MESSAGE_KEY } from "../../utils/url-utils";

const deployUrl = process.env["DEPLOY_URL"] ?? "http://localhost:3000";

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
      const cdpSession = await page.createCDPSession();
      cdpSession.send("Network.setUserAgentOverride", {
        userAgent: await browser.userAgent(),
        acceptLanguage: languageRecord.codes[0],
      });

      await page.goto(deployUrl);

      // Await one render cycle
      await sleep(100);

      const title = await getTitle(page);

      expect(title).toMatch(languageRecord.translations.pageTitle);
    });
  });

  it(`should have the default language's title if the Accept-Language is not supported`, async () => {
    const defaultLanguage = getFirstAcceptedLanguage([
      "unknown",
      "language",
    ] as unknown as Array<LocaleCode>);
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
      `${deployUrl}/?${LATEST_QUERY_PARAM_MESSAGE_KEY}=CYQwLgpgPgthDO8QHNoDsRygBh1A7EA`,
    );
  });

  it("should show a share button if the operating system is iOS or Android", async () => {
    await page.evaluateOnNewDocument(() => {
      // @ts-ignore
      window["isNavigatorShareCalled"] = false;
      window.navigator.share = async data => {
        // @ts-ignore
        window["isNavigatorShareCalled"] = true;
        // @ts-ignore
        window["shareData"] = data;
      };
    });

    const cdpSession = await page.createCDPSession();
    cdpSession.send("Network.setUserAgentOverride", {
      userAgent: "iPhone",
    });

    await page.goto(deployUrl);

    const shareButton = await page.$("#share-button");

    if (!shareButton) {
      throw new Error("Share button not found");
    }

    const shareButtonText = await shareButton.evaluate(
      element => element.textContent,
    );
    expect(shareButtonText).toBe(TranslationsEn.shareButtonText);

    await shareButton.click();

    const isNavigatorShareCalled = await page.evaluate(
      // @ts-ignore
      () => window["isNavigatorShareCalled"],
    );
    expect(isNavigatorShareCalled).toBeTruthy();
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
      `${deployUrl}/?${LATEST_QUERY_PARAM_MESSAGE_KEY}=CYQwLgpgPgthDO8QHNoDsRygBh1A7EA`,
    );
  });

  it("should open a new card with the parsed message's parameters", async () => {
    await page.goto(
      `${deployUrl}/?${LATEST_QUERY_PARAM_MESSAGE_KEY}=CYQwLgpgPgthDO8QHNoDsRygBh1A7EA`,
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

  themes.forEach(({ name: themeName }) => {
    it(`should not break any accessibility tests if using ${themeName} theme`, async () => {
      await page.setBypassCSP(true);
      await page.click("#theme-picker-button");
      await page.click(`#theme-${themeName}`);

      const axePuppeteer = new AxePuppeteer(page);

      const { incomplete } = await axePuppeteer.analyze();

      expect(
        incomplete.filter(errorMessage => {
          // Axe cannot determine whether or not an element with
          // a background image has the correct color contrast.
          // In those cases, we'll have to resort to checking manually.

          const isContrastError = errorMessage.id === "color-contrast";
          const cannotGetContrastBecauseOfBackgroundImageOrPseudoElements =
            errorMessage.nodes
              .flatMap(({ any }) => any)
              .every(({ data }) =>
                [
                  "bgImage",
                  "bgGradient",
                  "bgOverlap",
                  "pseudoContent",
                ].includes(data.messageKey),
              );

          return !(
            isContrastError &&
            cannotGetContrastBecauseOfBackgroundImageOrPseudoElements
          );
        }),
      ).toHaveLength(0);
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

    const allAreDisabled = (
      await form.$$eval("input, textarea", elements =>
        (elements as (HTMLInputElement | HTMLTextAreaElement)[]).map(
          element => element.disabled,
        ),
      )
    ).every(isDisabled => isDisabled === true);

    expect(allAreDisabled).toBe(true);
  });

  it("should mark not mark any fields in an empty card as readonly", async () => {
    const form = await page.$("form");

    if (!form) {
      throw new Error("Form did not render");
    }

    const disabledFields = await form.$$("input, textarea");
    await Promise.all(
      disabledFields.map(async element => {
        const isDisabled = (
          await element.getProperty("disabled")
        )?.remoteObject().value;

        expect(isDisabled).toBe(false);
      }),
    );
  });

  it("should use the default language's pageTitle property as title", async () => {
    const language = languages.English;

    const title = await page.$eval("title", titleElement => {
      if (!titleElement) {
        throw new Error("Title element not found");
      }

      return titleElement.innerHTML;
    });

    const expectedTitle = language.translations.pageTitle;

    expect(title).toBe(expectedTitle);
  });

  it("should update the page title when the language changes", async () => {
    const newLanguage = languages.NorskBokmal;

    // Open language picker
    await page.click("#language-picker-button");

    // Change language
    await page.click("#language-nb");

    // Await one render cycle
    await sleep(100);

    const title = await getTitle(page);

    const expectedTitle = newLanguage.translations.pageTitle;

    expect(title).toBe(expectedTitle);
  });

  it("should update the page title when the language changes also on opened cards", async () => {
    // Make sure English is selected
    await page.click("#language-picker-button");
    await page.click("#language-en");

    const context = browser.defaultBrowserContext();
    await context.overridePermissions(deployUrl, ["clipboard-read"]);

    const oldLanguage = languages.English;
    const newLanguage = languages.NorskBokmal;

    const oldTitle = await getTitle(page);

    await page.type("#date-field", "date");

    await page.click("#copy-button");

    const copiedUrl = await page.evaluate(() => navigator.clipboard.readText());

    await page.goto(copiedUrl);

    // Open language picker
    await page.click("#language-picker-button");

    // Change language
    await page.click("#language-nb");

    const newTitle = await getTitle(page);

    const expectedOldTitle = oldLanguage.translations.pageTitle;
    const expectedNewTitle = newLanguage.translations.pageTitle;

    expect(oldTitle).toBe(expectedOldTitle);
    expect(newTitle).toBe(expectedNewTitle);
  });
});

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getTitle(page: Page) {
  return page.$eval("title", titleElement => {
    if (!titleElement) {
      throw new Error("Title element not found");
    }

    return titleElement.innerHTML;
  });
}
