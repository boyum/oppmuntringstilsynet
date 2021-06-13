// eslint-disable-next-line import/no-extraneous-dependencies
import { AxePuppeteer } from "@axe-core/puppeteer";
// eslint-disable-next-line import/no-extraneous-dependencies
import dotenv from "dotenv";
// eslint-disable-next-line import/no-extraneous-dependencies
import puppeteer from "puppeteer";
import { themes } from "../../types/Themes";

dotenv.config();

const deployUrl = process.env.DEPLOY_URL ?? "http://localhost:3000";

describe("Home", () => {
  beforeEach(async () => {
    await page.goto(deployUrl);
    await page.evaluate(() => localStorage.clear());
  });

  it("should be titled 'Oppmuntringstilsynet'", async () => {
    await expect(page.title()).resolves.toMatch("Oppmuntringstilsynet");
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

  it("should use the current page theme as the theme of the card", async () => {
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(deployUrl, ["clipboard-read"]);

    const incognitoBrowser = await puppeteer.launch({
      args: ["--incognito"],
    });
    const incognitoPage = await incognitoBrowser.newPage();

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

    incognitoBrowser.close();
  });

  it("should use the current page theme as the theme of the card even if the card is reset", async () => {
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(deployUrl, ["clipboard-read"]);

    const incognitoBrowser = await puppeteer.launch({
      args: ["--incognito"],
    });
    const incognitoPage = await incognitoBrowser.newPage();

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

    incognitoBrowser.close();
  });

  it("should use the current page theme as the theme of the card even if the page is reloaded", async () => {
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(deployUrl, ["clipboard-read"]);

    const incognitoBrowser = await puppeteer.launch({
      args: ["--incognito"],
    });
    const incognitoPage = await incognitoBrowser.newPage();

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

    incognitoBrowser.close();
  });

  themes.forEach(({ name: themeName }) => {
    it(`should not break any accessibility tests if using ${themeName} theme`, async () => {
      await page.setBypassCSP(true);
      await page.click("#theme-picker-button");
      await page.click(`#theme-${themeName}`);

      const { incomplete } = await new AxePuppeteer(page)
        .exclude("#buttons")
        .exclude("footer")
        .exclude("#message-body-field")
        .analyze();

      expect(incomplete).toHaveLength(0);
    });
  });
});
