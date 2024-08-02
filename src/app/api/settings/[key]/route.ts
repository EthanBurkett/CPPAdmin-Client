import SettingsModel, { ISettings } from "@/lib/models/Settings.model";
import { z } from "zod";

const validation: {
  [key: string]: z.ZodEffects<any>;
} = {
  api_key: z
    .string()
    .min(6)
    .max(16)
    .refine((s) => !s.includes(" "), "No spaces allowed in api_key"),
};

export const GET = async (
  req: Request,
  {
    params,
  }: {
    params: { key: string };
  }
) => {
  const setting = await SettingsModel.findOne({ key: params.key }).catch(
    () => null
  );

  return new Response(
    JSON.stringify(setting || { key: params.key, value: null }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};

export const PUT = async (
  req: Request,
  {
    params,
  }: {
    params: { key: string };
  }
) => {
  try {
    const body = await req.json();
    console.log(Object.keys(validation).includes(params.key));
    if (!Object.keys(validation).includes(params.key))
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid key",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 400,
        }
      );
    const parse = validation[params.key].safeParse(body.value);
    if (!parse.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: parse.error,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 400,
        }
      );
    }

    const setting = await SettingsModel.findOneAndUpdate(
      { key: params.key },
      { key: params.key, value: body.value },
      { upsert: true, new: true }
    ).catch(() => ({ key: params.key, value: null }));

    if (!setting || !setting.value) {
      return new Response(
        JSON.stringify({
          key: params.key,
          value: null,
        }),
        {
          status: 400,
        }
      );
    }

    return new Response(JSON.stringify(setting), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({
        key: params.key,
        value: null,
      }),
      {
        status: 400,
      }
    );
  }
};
