import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getBackendBaseUrl } from "./backend";

export function useProgramIntroAssets(programKey, fallbacks) {
  const [assets, setAssets] = useState({
    img1: fallbacks.img1,
    img2: fallbacks.img2,
    video: fallbacks.video,
    quote: fallbacks.quote || "",
    description: fallbacks.description || "",
  });

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
          quote: data.introQuote || fallbacks.quote || "",
          description: data.introDescription || fallbacks.description || "",
        });
      } catch {
        if (!cancelled) {
          setAssets({
            img1: fallbacks.img1,
            img2: fallbacks.img2,
            video: fallbacks.video,
            quote: fallbacks.quote || "",
            description: fallbacks.description || "",
          });
        }
      }
    };

    fetchAssets();
    return () => {
      cancelled = true;
    };
  }, [
    apiUrl,
    fallbacks.img1,
    fallbacks.img2,
    fallbacks.video,
    fallbacks.quote,
    fallbacks.description,
  ]);

  return assets;
}
