import { ISettings } from "@/lib/models/Settings.model";
import { useEffect, useState } from "react";

export const useSetting = (key: string) => {
  const [value, setValue] = useState<string | null>(null);

  try {
    useEffect(() => {
      const fetchSetting = async () => {
        const response = await fetch(`/api/settings/${key}`);
        const data = await response.json();
        setValue(data?.value);
      };

      fetchSetting();
    }, [key]);
  } catch (e) {
    console.error(e);
  }

  return value;
};
