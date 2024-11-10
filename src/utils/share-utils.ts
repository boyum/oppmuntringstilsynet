import { Message } from "../types/Message";
import { createMessageUrl } from "./clipboard-utils";
import { getTranslations } from "./translations-utils";

export function getShareTitle(message: Message): string {
  const translations = getTranslations(message.language);

  return translations.previewTitleWithMessage.replace(
    /\{name\}/g,
    message.name || translations.someone,
  );
}

export function share(message: Message): Promise<void> {
  const url = createMessageUrl(message, window.location.href);
  const title = getShareTitle(message);

  return navigator.share({
    title,
    url: url.href,
  });
}
