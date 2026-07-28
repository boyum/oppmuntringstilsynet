import type { Metadata } from "next";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import HomePage from "../components/HomePage/HomePage";
import { getDefaultHtmlHeadData } from "../utils/html-head-utils";
import {
  getHomePageProps,
  getResolvedUrl,
} from "../utils/home-page-props-utils";
import { LATEST_QUERY_PARAM_MESSAGE_KEY } from "../utils/url-utils";

type PageProps = {
  searchParams:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const resolvedUrl = getResolvedUrl(params);
  const headerStore = await headers();
  const cookieStore = await cookies();

  const { host, "accept-language": acceptLanguage } = Object.fromEntries(
    headerStore.entries(),
  );

  const props = getHomePageProps({
    resolvedUrl,
    host,
    acceptLanguage,
    languageCookie: cookieStore.get("language")?.value,
    themeCookie: cookieStore.get("theme")?.value as
      | React.ComponentProps<typeof HomePage>["preferredTheme"]["name"]
      | undefined,
  });

  const { title, description, ogTitle, ogDescription } =
    getDefaultHtmlHeadData(props.preferredLanguage);

  const ogImageUrl = `${props.deployUrl}/api/og-image${
    props.encodedMessage
      ? `?${LATEST_QUERY_PARAM_MESSAGE_KEY}=${props.encodedMessage}`
      : ""
  }`;

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "website",
      url: `${props.deployUrl}${resolvedUrl}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 627,
          alt: ogTitle,
        },
      ],
    },
    icons: {
      icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>%F0%9F%92%95</text></svg>",
    },
  };
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const resolvedUrl = getResolvedUrl(params);
  const headerStore = await headers();
  const cookieStore = await cookies();

  const { host, "accept-language": acceptLanguage, "user-agent": userAgent } =
    Object.fromEntries(headerStore.entries());

  const props = getHomePageProps({
    resolvedUrl,
    host,
    acceptLanguage,
    userAgent,
    languageCookie: cookieStore.get("language")?.value,
    themeCookie: cookieStore.get("theme")?.value as
      | React.ComponentProps<typeof HomePage>["preferredTheme"]["name"]
      | undefined,
  });

  return <HomePage {...props} />;
}
