import type { Message } from "../types/Message";
import { decodeMessageV1 } from "./encoding-utils-v1";
import { decodeMessageV2 } from "./encoding-utils-v2";
import { decodeMessageV3, encodeV3 } from "./encoding-utils-v3";

export const QUERY_PARAM_MESSAGE_KEY_V1 = "m";
export const QUERY_PARAM_MESSAGE_KEY_V2 = "n";
export const QUERY_PARAM_MESSAGE_KEY_V3 = "o";

export const LATEST_QUERY_PARAM_MESSAGE_KEY = QUERY_PARAM_MESSAGE_KEY_V3;

export function getEncodedAndDecodedMessage(
  queryParams: URLSearchParams,
): [string, Message] | [null, null] {
  const encodedMessageV1 = queryParams.get(QUERY_PARAM_MESSAGE_KEY_V1);
  const encodedMessageV2 = queryParams.get(QUERY_PARAM_MESSAGE_KEY_V2);
  const encodedMessageV3 = queryParams.get(QUERY_PARAM_MESSAGE_KEY_V3);

  if (encodedMessageV3) {
    const message = decodeMessageV3(encodedMessageV3);
    if (message) {
      return [encodedMessageV3, message];
    }
  }

  if (encodedMessageV2) {
    const message = decodeMessageV2(encodedMessageV2);

    // Convert encoded V2 to V3
    if (message) {
      return [encodeV3(message), message];
    }
  }

  if (encodedMessageV1) {
    const message = decodeMessageV1(encodedMessageV1);

    if (message) {
      // Convert encoded V1 to V3
      return [encodeV3(message), message];
    }
  }

  return [null, null];
}

export const latestEncoder = encodeV3;
