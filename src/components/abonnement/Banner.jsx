import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBackendBaseUrl } from "../../utils/backend";

const SECTION_KEY = "abonnement-page";

const DEFAULTS = {
  title: "Maak Je Lichaam Sterker, Blijf *Fit* en *Gezond*",
  bodyText:
    "We bieden een breed scala aan diensten aan om je fitnesservaring effectiever, flexibeler en creatiever te maken. Onze gekwalificeerde trainers zijn niet alleen goed uitgerust met kennis over fitness, gewichtsverlies, wedstrijdtrainingen en kickboksen, maar hebben zelf op hoog niveau deelgenomen aan wedstrijden in hun vakgebied. Door onze kennis kunnen wij trainingsprogramma’s aanbieden die allemaal zijn afgestemd op het doel en de wensen van de klant. Hieronder staan enkele diensten die wij aanbieden.",
  buttonLabel: "Start Je Training Vandaag!",
  buttonUrl: "/proefles",
  bannerImageUrl:
    "https://mysummerbodyclub.nl/wp-content/themes/my-summer-body-club/assets/Sterk_Fit_Gezond_-MSBC.jpg",
};

/** Renders *highlighted* words as orange spans */
function renderTitle(title) {
  const parts = String(title || "").split(/(\*[^*]+\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <span key={index} className="msbc_span">
          {part.slice(1, -1)}
        </span>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

const Banner = () => {
  const navigate = useNavigate();
  const apiUrl = useMemo(
    () => `${getBackendBaseUrl()}/api/fetch-home-section/${SECTION_KEY}`,
    []
  );

  const [content, setContent] = useState(DEFAULTS);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (!isMounted || !data?.success || !data.section) return;

        const section = data.section;
        setContent({
          title: section.title || DEFAULTS.title,
          bodyText: section.bodyText || DEFAULTS.bodyText,
          buttonLabel: section.buttonLabel || DEFAULTS.buttonLabel,
          buttonUrl: section.buttonUrl || DEFAULTS.buttonUrl,
          bannerImageUrl: section.bannerImageUrl || DEFAULTS.bannerImageUrl,
        });
      } catch {
        if (isMounted) setContent(DEFAULTS);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [apiUrl]);

  const handleButtonClick = () => {
    const url = content.buttonUrl || DEFAULTS.buttonUrl;
    if (url.startsWith("http://") || url.startsWith("https://")) {
      window.location.href = url;
      return;
    }
    navigate(url);
  };

  return (
    <>
      <div id="msbc_maak_je" className="pt-[100px]">
        <div className="container max-w-[1110px] mx-auto">
          <div className="msbc_ben_je_content_area">
            <div className="msbc_ben_je_left">
              <h3>{renderTitle(content.title)}</h3>
              <p className="msbc_normal_p">{content.bodyText}</p>

              <button
                className="button-focused-proefles msbc_ben_button"
                onClick={handleButtonClick}
              >
                {content.buttonLabel}
              </button>
              <div className="msbc_ben_social-profiles">
                <a className="msbc_ben_item" href="#">
                  <i className="fab fa-instagram"></i>
                </a>

                <a className="msbc_ben_item" href="#">
                  <i className="fab fa-pinterest"></i>
                </a>

                <a className="msbc_ben_item" href="#">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
            <div className="msbc_ben_je_right">
              <img src={content.bannerImageUrl} alt="Men After" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;
