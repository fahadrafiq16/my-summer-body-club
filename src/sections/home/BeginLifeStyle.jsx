import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import VideoModal from "../../components/home/VideoModal";
import BootCampImg from "../../images/bootcamp-banner-image.png";
import BootCampHome from "../../images/bootcamp-home-button.png";
import { getBackendBaseUrl } from "../../utils/backend";

const SECTION_KEY = "lifestyle-video";
const DEFAULT_EMBED = "https://www.youtube.com/embed/3A8X8O4dT5E";

export default function BeginLifeStyle() {
  const [youtubeUrl, setYoutubeUrl] = useState(DEFAULT_EMBED);
  const [bannerImageUrl, setBannerImageUrl] = useState("");

  const apiUrl = useMemo(
    () => `${getBackendBaseUrl()}/api/fetch-home-section/${SECTION_KEY}`,
    []
  );

  useEffect(() => {
    let isMounted = true;

    const fetchSection = async () => {
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (isMounted && data?.success && data.section) {
          if (data.section.youtubeEmbedUrl) {
            setYoutubeUrl(data.section.youtubeEmbedUrl);
          }
          setBannerImageUrl(data.section.bannerImageUrl || "");
        }
      } catch {
        if (isMounted) setYoutubeUrl(DEFAULT_EMBED);
      }
    };

    fetchSection();
    return () => {
      isMounted = false;
    };
  }, [apiUrl]);

  return (
    <section id="begin-lifestyle" className="pt-[50px]">
      <div className="container max-w-[1110px] mx-auto">
        <div className="video-area-life" style={{ paddingBottom: "40px" }}>
          <div className="lifestyle-banner">
            {bannerImageUrl && (
              <img
                src={bannerImageUrl}
                alt="Begin een nieuwe lifestyle"
                style={{ width: "auto", height: "auto", maxWidth: "100%" }}
              />
            )}
          </div>
          <div className="section-title flex align-center justify-center">
            <h2 style={{ padding: "0" }}>
              Begin Een Nieuwe Life <span>Style</span>
            </h2>
          </div>
          <div>
            <div className="main-video-area">
              <div className="video-area-logo flex align-center justify-center">
                <img src={BootCampImg} alt="video area logo" />
              </div>
              <div className="video-image">
                <img src={BootCampImg} alt="bootcamp video" />
              </div>
              <div className="my-[20px]">
                <VideoModal youtubeUrl={youtubeUrl} />
              </div>
              <Link to="/bootcamp">
                <img className="bootcamp-link" src={BootCampHome} alt="bootcamp-link" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
