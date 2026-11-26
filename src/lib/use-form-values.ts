"use client";

import { useCallback, useState } from "react";

/**
 * Keeps form fields controlled so their contents survive a failed submit.
 *
 * React 19 resets an uncontrolled `<form action={…}>` once the action
 * returns — including when the action returns validation errors. For a
 * buyer who mistyped a phone number that means losing the whole enquiry they
 * just wrote, which is unacceptable on a form whose entire job is to get one
 * message to a supplier. Holding the values in React state restores them on
 * the re-render that follows the reset.
 */
export function useFormValues<T extends Record<string, string>>(initial: T) {
  const [values, setValues] = useState<T>(initial);

  const set = useCallback((name: keyof T, value: string) => {
    setValues((previous) => ({ ...previous, [name]: value }));
  }, []);

  /** Spread onto an `<input>` or `<textarea>`. */
  const bind = useCallback(
    (name: keyof T & string) => ({
      name,
      value: values[name],
      onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => set(name, event.target.value),
    }),
    [values, set],
  );

  /** For Radix Select, which reports a bare string. */
  const bindSelect = useCallback(
    (name: keyof T & string) => ({
      name,
      value: values[name],
      onValueChange: (value: string) => set(name, value),
    }),
    [values, set],
  );

  return { values, set, bind, bindSelect };
}
