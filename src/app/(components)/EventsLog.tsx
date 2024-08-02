"use client";

// no cache

import React from "react";
import { useSocket } from "../(hooks)/useSocket";
import { CreateCommandResponse } from "@/types/SocketEvents";
import { useEventLog } from "../(hooks)/useEventLog";
import { IEventLog } from "@/lib/models/EventLog.model";
import Table, { ColumnData } from "./EventsLog/Table";
import dayjs from "dayjs";

type Props = {};

const columns: ColumnData<IEventLog>[] = [
  {
    key: "_id",
    title: "ID",
    render: ({ value }) => (
      <span className="text-xs text-neutral-400">{value}</span>
    ),
    canSearch: true,
  },
  {
    key: "createdAt",
    title: "Created At",
    sort: true,
    sortFunction: (a, b) => {
      return a.createdAt < b.createdAt ? 1 : -1;
    },
    render: ({ value }) => dayjs(value).format("DD-MM-YYYY [at] HH:mm:ss"),
  },
  {
    key: "command",
    title: "Command",
    canSearch: true,
    sort: true,
    render: ({ value }) => value,
  },
  {
    key: "guid",
    title: "GUID",
    render: ({ value }) => value,
  },
  {
    key: "pid",
    title: "Player ID",
    sort: true,
    render: ({ value }) => value,
  },
  {
    key: "name",
    title: "Name",
    canSearch: true,
    sort: true,
    render: ({ value }) => value,
  },
  {
    key: "message",
    title: "Message",
    render: ({ value }) => (
      <a title={value} className="truncate max-w-[400px]">
        {value}
      </a>
    ),
  },
];

const EventsLog = (props: Props) => {
  const [allEvents, setAllEvents] = React.useState<IEventLog[]>([]);
  const events = useEventLog() || [];

  React.useEffect(() => {
    setAllEvents(events);
  }, [events]);

  useSocket<CreateCommandResponse>("CreateCommand", async (data) => {
    const newEvent = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const newEventJson = await newEvent.json();
    setAllEvents((prev) => [...prev, newEventJson]);
  }) || [];

  return (
    <div className="flex flex-col gap-2 py-6">
      <Table
        columns={columns}
        data={allEvents}
        search={{
          enabled: true,
          placeholder: "Search by name, command or message...",
        }}
      />
    </div>
  );
};

export default EventsLog;
