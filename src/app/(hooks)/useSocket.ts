import { useEffect, useState } from "react";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:8000";

const events = ["CreateCommand"] as const;
type Events = (typeof events)[number];

interface Event<TEventData = {}> {
  event: string;
  data: TEventData;
}

export const useSocket = <TEventData = {}>(
  subscribeTo: Events,
  onUpdate?: (data: TEventData) => void
) => {
  const [messages, setMessages] = useState<TEventData[] | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("message", (msg: Event<TEventData>) => {
      if (msg.event !== subscribeTo) {
        return;
      }

      if (onUpdate) onUpdate(msg.data);

      setMessages((prevMessages) => {
        if (!prevMessages) {
          return [msg.data];
        }

        return [...prevMessages, msg.data];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [messages, subscribeTo]);

  return messages;
};
