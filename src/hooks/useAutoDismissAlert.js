import { useEffect, useState } from "react";

export default function useAutoDismissAlert(initialMessage = "", delay = 5000) {
  const [message, setMessage] = useState(initialMessage);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, delay);

    return () => clearTimeout(timer);
  }, [message, delay]);

  return {
    message,
    setMessage,
    clearMessage: () => setMessage("")
  };
}
