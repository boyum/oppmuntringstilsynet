import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { getMetadata } from "../utils/metadata-utils";
import { getHomeServerProps, toURLSearchParams } from "../utils/server-props";
import { Home } from "./home";

export const runtime = "nodejs";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const props = await getHomeProps(searchParams);

  return <Home {...props} />;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const props = await getHomeProps(searchParams);

  return getMetadata({
    language: props.preferredLanguage,
    ogUrl: `${props.deployUrl}${props.resolvedUrl}`,
    deployUrl: props.deployUrl,
    encodedMessage: props.encodedMessage,
  });
}

async function getHomeProps(
  searchParams: Promise<Record<string, string | string[] | undefined>>,
) {
  const [resolvedSearchParams, headerStore, cookieStore] = await Promise.all([
    searchParams,
    headers(),
    cookies(),
  ]);

  const urlSearchParams = toURLSearchParams(resolvedSearchParams);
  const resolvedUrl = `/${urlSearchParams.size > 0 ? `?${urlSearchParams}` : ""}`;

  const acceptLanguage = headerStore.get("accept-language") ?? "";
  const host = headerStore.get("host");
  const proto = headerStore.get("x-forwarded-proto");
  const userAgent = headerStore.get("user-agent");

  const languageCookie = cookieStore.get("language")?.value;
  const themeCookie = cookieStore.get("theme")?.value;

  return getHomeServerProps({
    searchParams: urlSearchParams,
    resolvedUrl,
    host,
    proto,
    acceptLanguage,
    userAgent,
    languageCookie,
    themeCookie,
  });
}
