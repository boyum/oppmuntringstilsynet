import {default as React} from "react";
import {default as LanguageStore} from "../stores/LanguageStore";
import {default as MessageStore} from "../stores/MessageStore";
import "../styles/globals.css";

function Oppmuntringstilsynet({Component, pageProps}) {
	/* rome-ignore lint/jsx/noPropSpreading */
	return <MessageStore>
		<LanguageStore>
			<Component {...pageProps} />
		</LanguageStore>
	</MessageStore>;
}

export default Oppmuntringstilsynet;
