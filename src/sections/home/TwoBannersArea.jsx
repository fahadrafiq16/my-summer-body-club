import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBackendBaseUrl } from "../../utils/backend";

const INFORMATIE_KEY = "informatie-page";
const PROEFLES_KEY = "proefles-page";
const CACHE_KEY = "msbc_info_pages_visibility";

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function writeCache(patch) {
  try {
    const prev = readCache() || {};
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ...prev, ...patch }));
  } catch {
    /* ignore */
  }
}

const TwoBannersArea = () => {
  const cached = readCache();
  // null = loading — don't flash banners that may be turned off
  const [informatieVisible, setInformatieVisible] = useState(
    () => (typeof cached?.informatie === "boolean" ? cached.informatie : null)
  );
  const [proeflesVisible, setProeflesVisible] = useState(
    () => (typeof cached?.proefles === "boolean" ? cached.proefles : null)
  );

  useEffect(() => {
    let isMounted = true;
    const base = getBackendBaseUrl();

    const load = async (sectionKey, cacheField, setVisible) => {
      try {
        const res = await fetch(`${base}/api/fetch-home-section/${sectionKey}`);
        if (!res.ok) {
          if (isMounted) setVisible((prev) => (prev === null ? true : prev));
          return;
        }
        const data = await res.json();
        if (!isMounted) return;
        const visible = data?.success && data.section ? data.section.isActive !== false : true;
        setVisible(visible);
        writeCache({ [cacheField]: visible });
      } catch {
        if (isMounted) setVisible((prev) => (prev === null ? true : prev));
      }
    };

    load(INFORMATIE_KEY, "informatie", setInformatieVisible);
    load(PROEFLES_KEY, "proefles", setProeflesVisible);

    return () => {
      isMounted = false;
    };
  }, []);

  if (informatieVisible !== true && proeflesVisible !== true) return null;

  return (
    <section id="two-banners-area" className="padding-top ]">
      <div className="container">
        <div className="two-banners-area">
          {informatieVisible === true && (
            <div className="banner-left banner">
              <p className="sub-heading">Start Vandaag Je Nieuwe Life Style</p>
              <p className="bold-heading">
                Voor Meer<span> Informatie</span>
              </p>
              <Link className="bordered-button" to="/informatie">
                Hier Aanvragen
              </Link>
            </div>
          )}
          {proeflesVisible === true && (
            <div className="banner-right banner">
              <p className="sub-heading">Start Vandaag Je Nieuwe Life Style</p>
              <p className="bold-heading">
                Voor Meer<span> Proefles</span>
              </p>
              <Link className="bordered-button" to="/proefles">
                Hier Aanvragen
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TwoBannersArea;
