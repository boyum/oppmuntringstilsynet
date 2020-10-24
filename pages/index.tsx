import {default as http} from "http";
import {default as Head} from "next/head";
import {useRouter} from "next/router";
import {default as React, useContext, useEffect, useRef, useState} from "react";
import {default as Buttons} from "../components/Buttons";
import {default as Footer} from "../components/Footer";
import {default as Form} from "../components/Form";
import {default as LanguagePicker} from "../components/LanguagePicker";
import {default as LanguageContext} from "../contexts/LanguageContext";
import {default as MessageContext} from "../contexts/MessageContext";
import {default as LanguageEnum} from "../enums/Language";
import {default as styles} from "../styles/Home.module.css";
import {isEmpty} from "../utils/message-utils";
import {getTranslations} from "./api/translations";
import {decodeMessage, encode} from "./api/url";

type Props = {
	currentUrl: string;
	encodedMessage: string;
	host: string;
};

export default function pages({encodedMessage, currentUrl, host}: Props) {
	const [language, dispatchLanguageAction] = useContext(LanguageContext);
	const [message, dispatchMessageAction] = useContext(MessageContext);
	const [isDisabled, setIsDisabled] = useState(false);
	const [isResetting, setIsResetting] = useState(false);

	const router = useRouter();
	const tempInput = useRef<HTMLInputElement>(null);

	const messageFromUrl = decodeMessage(encodedMessage);
	const translations = getTranslations(language);

	const ogImageUrl = `https://${host}/og-image.jpg`;

	useEffect(() => {
		const hasMessage = !!messageFromUrl;
		const messageIsEmpty = isEmpty(message);

		if (hasMessage && messageIsEmpty && !isResetting) {
			dispatchMessageAction({type: "setValue", payload: messageFromUrl});
			dispatchLanguageAction({
				type: "setLanguage",
				payload: messageFromUrl.language,
			});
			setIsDisabled(true);
		}
	});

	const tagManagerHtml = `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
	})(window,document,'script','dataLayer','GTM-MPPJRMK');</script>`;

	const faviconUrl = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>\u{1f495}</text></svg>";

	function handleCopy() {
		const encodedMessage = encode(message);
		const url = new URL(window.location.href);
		url.searchParams.set("m", encodedMessage);

		tempInput.current.value = url.href;
		tempInput.current.select();
		tempInput.current.setSelectionRange(0, 99_999);
		document.execCommand("copy");
	}

	function handleReset() {
		router.push("/");
		dispatchMessageAction({type: "reset"});
		setIsResetting(true);
		setIsDisabled(false);
	}

	function handleLanguageChange(newLanguage: LanguageEnum) {
		dispatchMessageAction({
			type: "setValue",
			payload: {
				language: newLanguage,
			},
		});
	}

	// rome-ignore lint/react/noDanger
	return <>
		<Head>
			<title>
				{translations.pageTitle}
			</title>
			<link rel="icon" href={faviconUrl} />
			<link href="https://fonts.googleapis.com/css2?family=Roboto+Slab&amp;display=swap"
			rel="stylesheet" />
			<div dangerouslySetInnerHTML={{__html: tagManagerHtml}} />
			<meta property="og:title" content={translations.pageTitle} />
			<meta property="og:description" content={translations.pageDescription} />
			<meta property="og:image" content={ogImageUrl} />
			<meta property="og:url" content={currentUrl} />
			<meta property="og:type" content="website" />
		</Head>
		<noscript>
			<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MPPJRMK"
			title="Google Tag Manager"
			height="0"
			width="0"
			style={{display: "none", visibility: "hidden"}} />
		</noscript>
		<main className={styles.main}>
			<div className={styles.container}>
				<div className={styles.containerHeader}>
					<h1 className={styles.heading}>
						{translations.formHeading}
					</h1>
					<div className={styles.languagePickerContainer}>
						<LanguagePicker handleChange={handleLanguageChange} />
					</div>
				</div>
				<Form isDisabled={isDisabled} />
				<Buttons handleReset={handleReset} handleCopy={handleCopy} />
				<label className="hidden">
					Hidden label used for copying
					<input ref={tempInput} type="text" readOnly={true} tabIndex={-1} />
				</label>
			</div>
		</main>
		<Footer />
	</>;
}

type Context = {
	req: http.IncomingMessage;
	res: http.ServerResponse;
	resolvedUrl: string;
	query: {
		[key: string]: string;
	};
};

export async function getServerSideProps(context: Context) {
	return {
		props: ({
			encodedMessage: context.query.m ?? "",
			currentUrl: context.req.headers.host + context.resolvedUrl,
			host: context.req.headers.host,
		} as Props),
	};
}
