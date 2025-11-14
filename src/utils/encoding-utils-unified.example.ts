/**
 * Example integration of V4 encoding with backward compatibility
 *
 * This file demonstrates how to integrate V4 encoding while maintaining
 * support for existing V3, V2, and V1 encoded URLs.
 */

import type { Message } from "../types/Message";
import { decodeMessageV1 } from "./encoding-utils-v1";
import { decodeMessageV2 } from "./encoding-utils-v2";
import { decodeMessageV3 } from "./encoding-utils-v3";
import { decodeMessageV4, encodeV4 } from "./encoding-utils-v4";

/**
 * Encode a message using the latest V4 format
 *
 * V4 provides 15-18% shorter URLs compared to V3
 */
export function encodeMessage(message: Message): string {
  return encodeV4(message);
}

/**
 * Decode a message, trying V4 first, then falling back to older versions
 *
 * This ensures backward compatibility with existing URLs
 */
export function decodeMessage(encodedMessage: string): Message | null {
  // Quick validation
  if (!encodedMessage?.trim()) {
    return null;
  }

  // Try V4 first (newest, most efficient)
  // V4 uses base64url: only contains [A-Za-z0-9_-]
  const isV4Format = /^[A-Za-z0-9_-]+$/.test(encodedMessage);
  if (isV4Format) {
    const result = decodeMessageV4(encodedMessage);
    if (result) return result;
  }

  // Fall back to V3 (LZ-String format)
  const v3Result = decodeMessageV3(encodedMessage);
  if (v3Result) return v3Result;

  // Fall back to V2
  const v2Result = decodeMessageV2(encodedMessage);
  if (v2Result) return v2Result;

  // Fall back to V1 (oldest)
  const v1Result = decodeMessageV1(encodedMessage);
  if (v1Result) return v1Result;

  return null;
}

/**
 * Alternative approach: Try all decoders in sequence
 *
 * This is simpler but slightly less efficient as it doesn't
 * do format detection first
 */
export function decodeMessageSimple(encodedMessage: string): Message | null {
  return (
    decodeMessageV4(encodedMessage) ||
    decodeMessageV3(encodedMessage) ||
    decodeMessageV2(encodedMessage) ||
    decodeMessageV1(encodedMessage) ||
    null
  );
}

/**
 * Get encoding version information for analytics/debugging
 */
export function getEncodingVersion(encodedMessage: string): number | null {
  if (!encodedMessage?.trim()) return null;

  if (/^[A-Za-z0-9_-]+$/.test(encodedMessage)) {
    // V4 format detected
    if (decodeMessageV4(encodedMessage)) return 4;
  }

  if (decodeMessageV3(encodedMessage)) return 3;
  if (decodeMessageV2(encodedMessage)) return 2;
  if (decodeMessageV1(encodedMessage)) return 1;

  return null;
}
