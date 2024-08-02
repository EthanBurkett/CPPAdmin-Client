"use client";

import React, { useState } from "react";
import { useSetting } from "../(hooks)/useSetting";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { set } from "mongoose";

type Props = {
  overrideText?: string;
};

const ApiKeyPrompt = (props: Props) => {
  const [loading, setLoading] = useState(true);
  React.useEffect(() => {
    setLoading(false);
  }, []);

  let apiKey = useSetting("api_key");
  const [apiKeySet, setApiKeySet] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!loading && apiKey) {
      setApiKeySet(true);
    }
  }, [apiKey]);
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
    setApiKeySet(true);
  };

  return (
    <AlertDialog open={!apiKeySet}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex flex-col gap-4 text-neutral-100">
            <h1 className="text-2xl text-brand">API Key Required</h1>
            <p className="text-neutral-400">
              {!props.overrideText
                ? "You must set an API key to be shared amongst the CPPAdmin application and this panel."
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
          <AlertDialogAction onClick={submit}>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ApiKeyPrompt;
