import { IEventLog } from "@/lib/models/EventLog.model";
import { useEffect, useState } from "react";

export const useEventLog = () => {
  const [events, setEvents] = useState<IEventLog[] | null>(null);

  try {
    useEffect(() => {
      const fetchEvents = async () => {
        const response = await fetch("/api/events");
        const data = await response.json();
        setEvents(data);
      };

      fetchEvents();
    }, []);
  } catch (e) {
    console.error(e);
  }

  return events;
};
