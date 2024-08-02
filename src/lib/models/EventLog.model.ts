import mongoose from "mongoose";

const { Schema, model, models, Document } = mongoose;

export interface IEventLog {
  _id: string;
  command: string;
  guid: string;
  pid: string;
  name: string;
  message?: string;
  createdAt: Date;
}

const EventLogSchema = new Schema<IEventLog>(
  {
    command: { type: String, required: true },
    guid: { type: String, required: true },
    pid: { type: String, required: true },
    name: { type: String, required: true },
    message: { type: String },
  },
  {
    timestamps: true,
  }
);

let EventLogModel: mongoose.Model<IEventLog>;
try {
  EventLogModel = models.EventLog || model<IEventLog>("EventLog");
} catch (e) {
  EventLogModel = model("EventLog", EventLogSchema);
}

export default EventLogModel;
