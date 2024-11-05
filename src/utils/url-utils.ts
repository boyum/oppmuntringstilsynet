import type { Message } from "../types/Message";
import { decodeMessageV1 } from "./encoding-utils-v1";
import { decodeMessageV2, encodeV2 } from "./encoding-utils-v2";

export const QUERY_PARAM_MESSAGE_KEY_V1 = "m";
export const QUERY_PARAM_MESSAGE_KEY_V2 = "n";

export const ACTIVE_QUERY_PARAM_MESSAGE_KEY = QUERY_PARAM_MESSAGE_KEY_V2;

export function getEncodedAndDecodedMessage(
  queryParams: URLSearchParams,
): [string, Message] | [null, null] {
  const encodedMessageV1 = queryParams.get(QUERY_PARAM_MESSAGE_KEY_V1);
  const encodedMessageV2 = queryParams.get(QUERY_PARAM_MESSAGE_KEY_V2);

  if (encodedMessageV2) {
    const message = decodeMessageV2(encodedMessageV2);
    if (message) {
      return [encodedMessageV2, message];
    }
  }

  if (encodedMessageV1) {
    const message = decodeMessageV1(encodedMessageV1);
    if (message) {
      // Convert encoded V1 to V2
      return [encodeV2(message), message];
    }
  }

  return [null, null];
}
