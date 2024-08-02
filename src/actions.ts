import { CreateCommandResponse } from "./types/SocketEvents";
import EventLogModel from "./lib/models/EventLog.model";
import SettingsModel from "./lib/models/Settings.model";

export const getEvents = async () => {
  return await EventLogModel.find();
};

export const createEvent = async (event: CreateCommandResponse) => {
  await EventLogModel.create(event);
};

export const getSetting = async (key: string) => {
  return await SettingsModel.findOne({ key })
    .then((setting) => {
      return setting?.value || null;
    })
    .catch(() => null);
};

export const setSetting = async (key: string, value: string) => {
  return await SettingsModel.findOneAndUpdate(
    { key },
    { key, value },
    { upsert: true }
  );
};
