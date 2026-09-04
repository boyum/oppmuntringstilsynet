import type { Metadata } from "next";
import { headers } from "next/headers";
import type { ReactElement } from "react";
import { getFirstAcceptedLanguage } from "../../utils/language-utils";
import { getMetadata } from "../../utils/metadata-utils";
import {
  getAcceptedLanguages,
  toURLSearchParams,
} from "../../utils/server-props";
import { getEncodedAndDecodedMessage } from "../../utils/url-utils";
import SocialMediaPreview, {
  type SocialMediaPreviewProps,
} from "./social-media-preview";

export const runtime = "nodejs";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({
  searchParams,
}: PageProps): Promise<ReactElement> {
  const props = await getSocialMediaPreviewProps(searchParams);

  return <SocialMediaPreview {...props} />;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const props = await getSocialMediaPreviewProps(searchParams);

  return getMetadata({
    language: props.preferredLanguage,
    ogUrl: "/social-media-preview",
    deployUrl: "",
    encodedMessage: null,
  });
}

async function getSocialMediaPreviewProps(
  searchParams: Promise<Record<string, string | string[] | undefined>>,
): Promise<SocialMediaPreviewProps> {
  const [resolvedSearchParams, headerStore] = await Promise.all([
    searchParams,
    headers(),
  ]);

  const urlSearchParams = toURLSearchParams(resolvedSearchParams);
  const [, message] = getEncodedAndDecodedMessage(urlSearchParams);

  const acceptLanguage = headerStore.get("accept-language") ?? "";
  const preferredLanguage = getFirstAcceptedLanguage(
    getAcceptedLanguages(acceptLanguage),
  );

  return {
    message,
    preferredLanguage,
  };
}
