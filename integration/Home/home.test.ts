// eslint-disable-next-line import/no-extraneous-dependencies
import dotenv from "dotenv";

dotenv.config();

const deployUrl = process.env.DEPLOY_URL ?? "http://localhost:3000";

describe("Home", () => {
  beforeEach(async () => {
    await page.goto(deployUrl);
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
      `${deployUrl}/?m=N4IgxgFgpmDWDOIBcBtALgJwK5QDSZ32ygF1cQATAQzSmUprvIFsp54qBzOpEV9rkxAA7Kq3qjx5ADZVhnLIPoA5APYZ4sAEKrYzKtJDk00VsrE8QIAL5A`,
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
      `${deployUrl}/?m=N4IgxgFgpmDWDOIBcBtALgJwK5QDSZ32ygF1cQATAQzSmUprvIFsp54qBzOpEV9rkxAA7Kq3qjx5ADZVhnLIPoA5APYZ4sAEKrYzKtJDk00VsrE8QIAL5A`,
    );
  });

  it("should open a new card with the parsed message's parameters", async () => {
    await page.goto(`${deployUrl}/?m=N4IgxgFgpmDWDOIBcBtALgJwK5QDSZ32ygF1cQATAQzSmUprvIFsp54qBzOpEV9rkxAA7Kq3qjx5ADZVhnLIPoA5APYZ4sAEKrYzKtJDk00VsrE8QIAL5A`);


    const dateText = await page.evaluate(() => document.querySelector<HTMLInputElement>("#date-field")?.value);
    const messageText = await page.evaluate(() => document.querySelector<HTMLTextAreaElement>("#message-body-field")?.value);
    const checkbox0Value = await page.evaluate(() => document.querySelector<HTMLInputElement>("#checkbox-0")?.value);
    const checkbox1Value = await page.evaluate(() => document.querySelector<HTMLInputElement>("#checkbox-1")?.value);
    const checkbox2Value = await page.evaluate(() => document.querySelector<HTMLInputElement>("#checkbox-2")?.value);
    const nameText = await page.evaluate(() => document.querySelector<HTMLInputElement>("#name-field")?.value);

    expect(dateText).toBe("date");
    expect(messageText).toBe("message");
    expect(checkbox0Value).toBe("true");
    expect(checkbox1Value).toBe("true");
    expect(checkbox2Value).toBe("true");
    expect(nameText).toBe("name");
  });
});
