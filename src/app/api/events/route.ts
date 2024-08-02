import EventLogModel from "@/lib/models/EventLog.model";
export const GET = async (req: Request, res: Response) => {
  const events = await EventLogModel.find();
  return new Response(JSON.stringify(events), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST = async (req: Request, res: Response) => {
  try {
    const json = await req.json();
    const event = await EventLogModel.findOneAndUpdate(json, json, {
      upsert: true,
      new: true,
      sort: { createdAt: -1 },
    });

    return new Response(JSON.stringify(event), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify(e), {
      headers: { "Content-Type": "application/json" },
    });
  }
};
