import type { Message } from "../types/Message";
import { encodeV2 } from "./encoding-utils-v2";
import { ACTIVE_QUERY_PARAM_MESSAGE_KEY } from "./url-utils";

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
  const encodedMessage = encodeV2(message);
  const url = new URL(currentUrl);
  url.searchParams.set(ACTIVE_QUERY_PARAM_MESSAGE_KEY, encodedMessage);

  return url;
}

export function encodeAndCopyMessage(
  message: Message,
  inputElement: HTMLInputElement,
): void {
  const url = createMessageUrl(message, window.location.href);
  copyToClipboard(inputElement, url.href);
}
