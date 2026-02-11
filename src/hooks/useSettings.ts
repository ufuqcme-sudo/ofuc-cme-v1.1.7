import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SettingsMap {
  [key: string]: string;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("settings")
          .select("key, value");

        if (error) throw error;

        const map: SettingsMap = {};
        data?.forEach((item: { key: string; value: string }) => {
          map[item.key] = item.value;
        });
        setSettings(map);
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, isLoading };
};
