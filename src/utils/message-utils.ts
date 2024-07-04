import {
  emptyMessage_DO_NOT_USE,
  getEmptyState,
} from "../reducers/message.reducer";
import type { Message } from "../types/Message";

function isPrimitive(a: unknown) {
  return (
    typeof a === "string" || typeof a === "number" || typeof a === "boolean"
  );
}

function arrayHasOnlyPrimitiveValues(array: unknown[]): boolean {
  return array.every(isPrimitive);
}

function deepEqualMessage(a: Message, b: Message): boolean {
  // For all fields in a, check if they are equal to the corresponding field in b.
  return Object.entries(a).every(([k, aValue]) => {
    const key = k as keyof Message;
    const bValue = b[key];

    // If the property is an array, compare each element.
    if (Array.isArray(aValue)) {
      if (arrayHasOnlyPrimitiveValues(bValue as Array<unknown>)) {
        return aValue.every((element, index) => element === bValue[index]);
      }

      throw new Error(
        `Cannot compare objects in array '${key}'. Contents: ${JSON.stringify(bValue)}`,
      );
    }

    // If the property is a string, a number, or a boolean, compare the values.
    const valueType = typeof aValue;
    if (isPrimitive(bValue)) {
      return aValue === bValue;
    }

    // If the property is of an unknown type (e.g. an object), throw an error because of undefined behaviour.
    throw new Error(
      `Cannot compare objects. Type ${valueType} is not supported.`,
    );
  });
}

export function isEmpty(message: Message): boolean {
  return deepEqualMessage(emptyMessage_DO_NOT_USE, message);
}

export function createEmptyMessage(): Message {
  return {
    ...getEmptyState(),
  };
}
