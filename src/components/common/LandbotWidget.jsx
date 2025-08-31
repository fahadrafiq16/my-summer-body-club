import { useEffect } from "react";

export default function LandbotWidget() {
  useEffect(() => {
    const initLandbot = () => {
      if (!window.myLandbot) {
        const s = document.createElement("script");
        s.type = "module";
        s.async = true;
        s.src = "https://cdn.landbot.io/landbot-3/landbot-3.0.0.mjs";

        s.addEventListener("load", () => {
          window.myLandbot = new window.Landbot.Livechat({
            configUrl:
              "https://storage.googleapis.com/landbot.online/v3/H-1745744-3ZZORRYX7QGFJ7GJ/index.json",
          });
        });

        document.body.appendChild(s);
      }
    };

    window.addEventListener("mouseover", initLandbot, { once: true });
    window.addEventListener("touchstart", initLandbot, { once: true });

    return () => {
      window.removeEventListener("mouseover", initLandbot);
      window.removeEventListener("touchstart", initLandbot);
    };
  }, []);

  return null; // nothing to render, just injects script
}
