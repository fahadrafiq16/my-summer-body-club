import { useEffect, useMemo, useState } from "react";
import { getBackendBaseUrl } from "../utils/backend";

export function usePageHeroImage(sectionKey) {
  const [imageUrl, setImageUrl] = useState("");

  const apiUrl = useMemo(
    () => `${getBackendBaseUrl()}/api/fetch-home-section/${sectionKey}`,
    [sectionKey]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchSection = async () => {
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (isMounted && data?.success && data.section?.bannerImageUrl) {
          setImageUrl(data.section.bannerImageUrl);
        }
      } catch {
        /* keep fallback */
      }
    };

    fetchSection();
    return () => {
      isMounted = false;
    };
  }, [apiUrl]);

  return imageUrl;
}
