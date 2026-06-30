import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getBackendBaseUrl } from "./backend";

export function useProgramIntroAssets(programKey, fallbacks) {
  const [assets, setAssets] = useState(fallbacks);

  const apiUrl = useMemo(
    () => `${getBackendBaseUrl()}/api/program-config/${programKey}`,
    [programKey]
  );

  useEffect(() => {
    let cancelled = false;

    const fetchAssets = async () => {
      try {
        const res = await axios.get(apiUrl);
        if (cancelled) return;
        const data = res?.data || {};
        setAssets({
          img1: data.introImage1Url || fallbacks.img1,
          img2: data.introImage2Url || fallbacks.img2,
          video: data.introVideoUrl || fallbacks.video,
        });
      } catch {
        if (!cancelled) setAssets(fallbacks);
      }
    };

    fetchAssets();
    return () => {
      cancelled = true;
    };
  }, [apiUrl, fallbacks.img1, fallbacks.img2, fallbacks.video]);

  return assets;
}
