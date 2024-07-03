import type { Message } from "../types/Message";
import { encode } from "./url-utils";

export function copyToClipboard(
  inputElement: HTMLInputElement,
  text: string,
): void {
  inputElement.value = text;
  inputElement.select();
  inputElement.setSelectionRange(0, 100_000);
  document.execCommand("copy");
}

export function createMessageUrl(message: Message, currentUrl: string): URL {
  const encodedMessage = encode(message);
  const url = new URL(currentUrl);
  url.searchParams.set("m", encodedMessage);

  return url;
}

export function encodeAndCopyMessage(
  message: Message,
  inputElement: HTMLInputElement,
): void {
  const url = createMessageUrl(message, window.location.href);
  copyToClipboard(inputElement, url.href);
}
