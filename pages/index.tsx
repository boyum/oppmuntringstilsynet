import html2canvas from "html2canvas";
import http from "http";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import Buttons from "../components/Buttons";
import Footer from "../components/Footer";
import Form from "../components/Form";
import LanguagePicker from "../components/LanguagePicker";
import { ThemePicker } from "../components/ThemePicker/ThemePicker";
import LanguageContext from "../contexts/LanguageContext";
import MessageContext from "../contexts/MessageContext";
import LanguageEnum from "../enums/Language";
import styles from "../styles/Home.module.scss";
import { themes } from "../types/Themes";
import { isEmpty } from "../utils/message-utils";
import {
  getActiveTheme,
  getTheme,
  setActiveTheme,
  setPageTheme,
} from "./api/theme";
import { getTranslations } from "./api/translations";
import { decodeMessage, encode } from "./api/url";

type Props = {
  encodedParamMessage: string;
};

export default function Home({ encodedParamMessage }: Props): JSX.Element {
  const [language, dispatchLanguageAction] = useContext(LanguageContext);
  const [message, dispatchMessageAction] = useContext(MessageContext);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const router = useRouter();
  const copyInput = useRef<HTMLInputElement>(null);
  const formContainer = useRef<HTMLDivElement>(null);

  const messageFromUrl = decodeMessage(encodedParamMessage);
  const translations = getTranslations(language);

  useEffect(() => {
    if (!!messageFromUrl && isEmpty(message) && !isResetting) {
      dispatchMessageAction?.({ type: "setValue", payload: messageFromUrl });
      dispatchLanguageAction?.({
        type: "setLanguage",
        payload: messageFromUrl.language,
      });

      setIsDisabled(true);
    }

    if (messageFromUrl?.themeName) {
      const theme = getTheme(messageFromUrl.themeName, themes);
      setPageTheme(theme);
      setActiveTheme(theme.name);
    } else {
      const activeTheme = getActiveTheme(themes);
      setPageTheme(activeTheme);
    }
  }, []);

  function copy(text: string): void {
    if (copyInput?.current) {
      copyInput.current.value = text;
      copyInput.current.select();
      copyInput.current.setSelectionRange(0, 99999);
    }
    document.execCommand("copy");
  }

  function handleCopyLink(): void {
    const encodedMessage = encode(message);
    const url = new URL(window.location.href);
    url.searchParams.set("m", encodedMessage);

    copy(url.href);
  }

  function getDownloadAnchor(): HTMLAnchorElement {
    let anchor = document.querySelector(
      ".download-anchor",
    ) as HTMLAnchorElement;

    const theDownloadAnchorHasNotBeenCreatedYet = !anchor;
    if (theDownloadAnchorHasNotBeenCreatedYet) {
      anchor = document.createElement("a");
      anchor.classList.add("hidden", "download-anchor");
      anchor.innerText = "Download screenshot";
      document.body.appendChild(anchor); // Needs to be added to the DOM to work
    }

    return anchor;
  }

  async function createImage(): Promise<string | null> {
    if (!formContainer.current) {
      console.error("Form is not created", formContainer);
      return null;
    }

    const screenshottedElement = formContainer.current;
    const canvas = await html2canvas(screenshottedElement, {
      scrollX: 0,
      scrollY: -window.scrollY,
    });
    canvas.classList.add("hidden");

    document.body.appendChild(canvas);

    const url = canvas.toDataURL();

    document.body.removeChild(canvas);

    return url;
  }

  // async function handleCopyImage(): Promise<void> {
  //   const imageDataUrl = await createImage();
  //   copy(imageDataUrl);
  // }

  function download(url: string) {
    const dlAnchor = getDownloadAnchor();
    dlAnchor.href = url;
    dlAnchor.download = `Oppmuntringstilsynet-${new Date().toLocaleDateString()}`;
    dlAnchor.click();
  }

  async function handleDownloadImage(): Promise<void> {
    const imageDataUrl = await createImage();
    if (imageDataUrl) {
      download(imageDataUrl);
    }
  }

  function handleReset() {
    router.push("/");

    dispatchMessageAction?.({ type: "reset" });

    setIsResetting(true);
    setIsDisabled(false);
  }

  function handleLanguageChange(newLanguage: LanguageEnum) {
    dispatchMessageAction?.({
      type: "setValue",
      payload: {
        language: newLanguage,
      },
    });
  }

  return (
    <>
      <div className={styles.themePickerButtonWrapper}>
        <ThemePicker
          themes={themes}
          setTheme={theme => {
            setPageTheme(theme);
            setActiveTheme(theme.name);
          }}
        />
      </div>

      <main className={styles.main}>
        <div className={styles.container} ref={formContainer}>
          <div className={styles.containerHeader}>
            <h1 className={styles.heading}>{translations.formHeading}</h1>
            <div className={styles.languagePickerContainer}>
              <LanguagePicker handleChange={handleLanguageChange} />
            </div>
          </div>

          <Form isDisabled={isDisabled} />
          <Buttons
            handleReset={handleReset}
            handleCopyLink={handleCopyLink}
            handleDownloadImage={handleDownloadImage}
          />
          <label className="hidden">
            Hidden label used for copying
            <input ref={copyInput} type="text" readOnly tabIndex={-1} />
          </label>
        </div>
      </main>
      <Footer />
    </>
  );
}

type Context = {
  req: http.IncomingMessage;
  res: http.ServerResponse;
  resolvedUrl: string;
  query: {
    [key: string]: string;
  };
};

export async function getServerSideProps(
  context: Context,
): Promise<{ props: Props }> {
  return {
    props: {
      encodedParamMessage: context.query.m ?? "",
    } as Props,
  };
}
