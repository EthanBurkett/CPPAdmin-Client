"use client";

import React, { useState } from "react";
import { useSetting } from "../(hooks)/useSetting";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { set } from "mongoose";

type Props = {
  overrideText?: string;
};

const ChangeApiKey = (props: Props) => {
  const [loading, setLoading] = useState(true);
  React.useEffect(() => {
    setLoading(false);
  }, []);

  let apiKey = useSetting("api_key");

  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState("");

  const submit = async () => {
    const parse = z
      .string()
      .min(6)
      .max(32)
      .refine((s) => !s.includes(" "), "No spaces allowed in api_key")
      .safeParse(value);

    if (!parse.success) {
      setError(
        "API key must be between 6 and 32 characters and must not contain spaces."
      );
      return;
    }

    await fetch("/api/settings/api_key", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: parse.data }),
    }).catch(() => {
      setError("Failed to save API key.");
    });
    apiKey = parse.data;
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="transition-all text-lg hover:-translate-y-[2px] hover:text-transparent bg-clip-text to-[#1e5192] from-brand bg-gradient-to-tr">
        Change API Key
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex flex-col gap-4 text-neutral-100">
            <h1 className="text-2xl text-brand">API Key Change</h1>
            <p className="text-neutral-400">
              {!props.overrideText
                ? "Change your API key below."
                : props.overrideText}
            </p>
            <p className="text-red-400">{error}</p>
          </div>
          <div className="flex flex-col gap-4">
            <Input
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              placeholder="API Key"
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="!bg-neutral-900 text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={submit}>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ChangeApiKey;
