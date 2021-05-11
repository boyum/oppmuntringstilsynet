import html2canvas from "html2canvas";
import http from "http";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import Buttons from "../components/Buttons";
import Footer from "../components/Footer";
import Form from "../components/Form";
import LanguagePicker from "../components/LanguagePicker";
import { ThemePicker } from "../components/ThemePicker";
import LanguageContext from "../contexts/LanguageContext";
import MessageContext from "../contexts/MessageContext";
import LanguageEnum from "../enums/Language";
import styles from "../styles/Home.module.css";
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
  const [themePickerOpen, setThemePickerOpen] = useState(false);

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
      <ThemePicker
        themes={themes}
        isOpen={themePickerOpen}
        setTheme={theme => {
          setPageTheme(theme);
          setActiveTheme(theme.name);
        }}
      />

      <div className={styles.themePickerButtonWrapper}>
        <button
          type="button"
          onClick={() => setThemePickerOpen(!themePickerOpen)}
          className={styles.themePickerButton}
        >
          <span className="hidden">
            {themePickerOpen
              ? translations.closeThemePicker
              : translations.openThemePicker}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 310.278 310.278"
            aria-hidden="true"
          >
            <path d="M259.537 48.827C259.537 21.982 212.794 0 155.139 0 97.484 0 50.741 22.096 50.741 48.935c0 1.516.195 4.838.485 4.838h1.076c-.396 1.804.237 3.602.237 5.405v-4.751c-.061-.221-.166-.432-.222-.649h.222v.649c6.404 23.981 49.805 42.551 103.048 42.551 52.745 0 95.144-18.225 102.152-41.876v-1.324h.442c-.11.448-.311.881-.442 1.324v4.076c0-1.804.854-3.602.459-5.4h.854c.29 0 .485-3.427.485-4.951zm-10.631 4.05c-.738 3.812-2.764 7.462-5.838 10.897-13.505 15.061-47.729 25.779-87.93 25.779-35.861 0-67.03-8.517-82.933-21.049-5.988-4.72-9.748-10.012-10.839-15.628-.208-1.097-.393-2.199-.393-3.322 0-4.411 1.743-8.638 4.849-12.609 12.443-15.897 47.693-27.382 89.316-27.382 44.028 0 80.89 12.852 91.194 30.196 1.866 3.143 2.963 6.41 2.963 9.8.012 1.119-.178 2.221-.389 3.318z" />
            <path d="M156.787 23.053c-34.987 0-81.746 3.277-93.108 26.507-.491 1.008.179 2.221.427 3.322.841 3.694 3.077 7.251 6.479 10.584 13.84 13.561 46.965 23.393 84.56 23.393 37.594 0 70.717-9.827 84.56-23.393 3.401-3.333 5.632-6.89 6.48-10.584.243-1.097.865-2.288.422-3.322-10.02-23.683-53.183-26.507-89.82-26.507z" />
            <path d="M256.742 268.354l.997-2.178V74.77c-10.8 12.609-30.518 22.151-58.741 26.918 1.604.67 2.516 2.046 3.148 4.298 2.421 8.591 3.676 17.355 5.4 26.099.152.794.152 1.534.068 2.236 3.111 8.688 4.714 18.589 4.672 29.257-.026 7.15-8.827 8.633-12.577 3.406-6.186-8.638-12.281-19.029-19.865-27.49-3.902-2.426-7.783-3.607-10.805-1.967-.797 11.881-.854 23.582.521 35.326 2.142 9.303 4.198 18.589 5.527 27.87 1.682 11.755 7.287 33.144-3.48 42.319-35.391 30.186-40.353-51.479-41.305-66.287-.846-13.226-6.035-25.471-12.105-37.214.588 10.373 1.577 24.337-5.58 31.488-9.239 9.239-30.282 7.398-36.476-4.619-12.01-23.288-7.61-53.7-8.3-78.988-6.384-3.736-9.904-7.981-15.304-12.651v192.547l.886 1.038c4.644 23.51 49.352 41.924 101.487 41.924 52.136-.002 97.187-18.416 101.832-41.926zm-47.603-70.125c-10.8 0-10.8-13.5 0-13.5 5.4 0 5.4 13.5 0 13.5z" />
          </svg>
        </button>
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
