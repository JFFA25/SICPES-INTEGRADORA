import { useCallback, useRef, useState } from "react";

export type MessageType = "error" | "success" | "info";

export interface TimedMessage {
  text: string;
  type: MessageType;
}

const DEFAULT_DURATION_MS = 5000;

/**
 * Hook para mostrar un mensaje (error/éxito/info) que se autodestruye después
 * de `durationMs`. Pensado para usarse junto con <Alert />.
 */
export const useTimedMessage = (durationMs: number = DEFAULT_DURATION_MS) => {
  const [message, setMessage] = useState<TimedMessage | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setMessage(null);
  }, []);

  const showMessage = useCallback(
    (text: string, type: MessageType = "info") => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setMessage({ text, type });
      timeoutRef.current = setTimeout(() => {
        setMessage(null);
        timeoutRef.current = null;
      }, durationMs);
    },
    [durationMs]
  );

  const showError = useCallback((text: string) => showMessage(text, "error"), [showMessage]);
  const showSuccess = useCallback((text: string) => showMessage(text, "success"), [showMessage]);
  const showInfo = useCallback((text: string) => showMessage(text, "info"), [showMessage]);

  return { message, showMessage, showError, showSuccess, showInfo, clear };
};
