import {
  emptyMessage_DO_NOT_USE,
  getEmptyState,
} from "../reducers/message.reducer";
import type { Message } from "../types/Message";

function deepEqualMessage(a: Message, b: Message): boolean {
  // For all fields in a, check if they are equal to the corresponding field in b.
  return Object.entries(a).every(([k, aValue]) => {
    const key = k as keyof Message;

    const bValue = b[key];

    // If the property is an array, compare each element.
    if (Array.isArray(aValue)) {
      return aValue.every((element, index) => {
        // If the property is a string, a number, or a boolean, compare the values.
        const elementType = typeof element;
        if (
          elementType === "string" ||
          elementType === "number" ||
          elementType === "boolean"
        ) {
          return element === bValue[index];
        }

        // If the property is of an unknown type (e.g. an object), throw an error because of undefined behaviour.
        throw new Error(
          `Cannot compare objects in array '${key}'. Type ${elementType} is not supported.`,
        );
      });
    }

    // If the property is a string, a number, or a boolean, compare the values.
    const valueType = typeof aValue;
    if (
      valueType === "string" ||
      valueType === "number" ||
      valueType === "boolean"
    ) {
      return aValue === bValue;
    }

    // If the property is of an unknown type (e.g. an object), throw an error because of undefined behaviour.
    throw new Error(
      `Cannot compare objects. Type ${valueType} is not supported.`,
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
