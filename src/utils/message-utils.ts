import {
  emptyMessage_DO_NOT_USE,
  getEmptyState,
} from "../reducers/message.reducer";
import type { Message } from "../types/Message";

function deepEqualMessage(a: Message, b: Message): boolean {
  // For all fields in a, check if they are equal to the corresponding field in b.
  return Object.keys(a).every(k => {
    const key = k as keyof Message;

    // If the property is an array, compare each element.
    // If the property is a string, a number, or a boolean, compare the values.

    if (Array.isArray(a[key])) {
      return a[key].every((element, index) => element === b[key][index]);
    }

    if (
      typeof a[key] === "string" ||
      typeof a[key] === "number" ||
      typeof a[key] === "boolean"
    ) {
      return a[key] === b[key];
    }

    // If the property is of an unknown type (e.g. an object), throw an error because of undefined behaviour.
    throw new Error(
      `Cannot compare objects. Type ${typeof a[key]} is not supported.`,
    );
  });
}

export function isEmpty(message: Message): boolean {
  return deepEqualMessage(message, emptyMessage_DO_NOT_USE);
}

export function createEmptyMessage(): Message {
  return {
    ...getEmptyState(),
  };
}
