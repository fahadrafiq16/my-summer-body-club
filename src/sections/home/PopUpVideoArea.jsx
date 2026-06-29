import React, { useEffect, useMemo, useState } from "react";
import VideoModal from "../../components/home/VideoModal";
import PTImg from "../../images/PT-Training_Post-1_09.24.png";
import AfvallenImg from "../../images/Afval-Training-2_09.24.png";
import { getBackendBaseUrl } from "../../utils/backend";

const SECTION_KEY = "popup-video-area";
const DEFAULT_EMBED = "https://www.youtube.com/embed/3A8X8O4dT5E";

export default function PopUpVideoArea() {
  const [leftImage, setLeftImage] = useState(PTImg);
  const [rightImage, setRightImage] = useState(AfvallenImg);
  const [youtubeUrl, setYoutubeUrl] = useState(DEFAULT_EMBED);

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
        if (!isMounted || !data?.success || !data.section) return;

        const section = data.section;
        if (section.youtubeEmbedUrl) setYoutubeUrl(section.youtubeEmbedUrl);
        if (section.leftImageUrl) setLeftImage(section.leftImageUrl);
        if (section.rightImageUrl) setRightImage(section.rightImageUrl);
      } catch {
        if (isMounted) {
          setLeftImage(PTImg);
          setRightImage(AfvallenImg);
          setYoutubeUrl(DEFAULT_EMBED);
        }
      }
    };

    fetchSection();
    return () => {
      isMounted = false;
    };
  }, [apiUrl]);

  return (
    <section id="popup-video-area">
      <div className="container grid-3-custom">
        <div className="video-banner">
          <img width="841" height="980" src={leftImage} alt="PT training banner" />
        </div>

        <div className="main-video-area">
          <div id="video-button" className="video-button">
            <VideoModal youtubeUrl={youtubeUrl} />
          </div>
        </div>

        <div className="video-banner">
          <img width="840" height="980" src={rightImage} alt="Afvallen training banner" />
        </div>
      </div>
    </section>
  );
}
