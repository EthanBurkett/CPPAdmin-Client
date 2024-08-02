import Image from "next/image";
import EventsLog from "./(components)/EventsLog";
import { useEventLog } from "./(hooks)/useEventLog";
import { CreateCommandResponse } from "@/types/SocketEvents";
import { useSocket } from "./(hooks)/useSocket";

export default async function Home() {
  return (
    <div className="max-h-[100%] overflow-y-auto px-12">
      <h1 className="text-3xl font-bold">Event Logs</h1>
      <EventsLog />
    </div>
  );
}
