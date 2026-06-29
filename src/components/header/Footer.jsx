import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import animatedLogo from "../../images/animating-logo.gif";
import { getBackendBaseUrl } from "../../utils/backend";
import FacebookPagePlugin from "../footer/FacebookPagePlugin";
import FooterSocialLinks from "../footer/FooterSocialLinks";

const SECTION_KEY = "footer";

const FALLBACK = {
  column1Title: "Onze Trainingen",
  column1Links: [
    { title: "Kies Afvallen", url: "/trainingprograms/afvallen-training/" },
    { title: "Kies Groep PT", url: "/trainingprograms/groeppt-training/" },
    { title: "Kies Personal Training", url: "/trainingprograms/personal-training/" },
    { title: "Kies Wedstrijd Training", url: "/trainingprograms/wedstrijd-training/" },
  ],
  column4Title: "Info & Service",
  column4Links: [
    { title: "Algemene voorwaarden", url: "/algemene-voorwaarden/" },
    { title: "Privacyverklaring", url: "/privacyverklaring/" },
  ],
  legalText: "Algemene voorwaarden | Privacybeleid | KVK 59250097 | Btw: NL003699102B10",
  facebookPageUrl: "https://www.facebook.com/mysummerbodyclub",
  socialLinks: [
    { platform: "facebook", url: "https://www.facebook.com/mysummerbodyclub/" },
    { platform: "instagram", url: "https://www.instagram.com/mysummerbodyclub/" },
    { platform: "pinterest", url: "https://pinterest.com/mysummerbodyclub/" },
    { platform: "youtube", url: "https://www.youtube.com/@mysummerbodyclub" },
  ],
};

function FooterNavLink({ url, children }) {
  if (url?.startsWith("/")) {
    return <Link to={url}>{children}</Link>;
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function buildFooterState(section) {
  if (!section) return { ...FALLBACK, logoImage: animatedLogo };

  return {
    column1Title: section.footerColumn1Title || FALLBACK.column1Title,
    column1Links: section.footerColumn1Links?.length ? section.footerColumn1Links : FALLBACK.column1Links,
    column4Title: section.footerColumn4Title || FALLBACK.column4Title,
    column4Links: section.footerColumn4Links?.length ? section.footerColumn4Links : FALLBACK.column4Links,
    logoImage: section.footerLogoImageUrl || animatedLogo,
    legalText: section.footerLegalText || FALLBACK.legalText,
    facebookPageUrl: section.facebookPageUrl || FALLBACK.facebookPageUrl,
    socialLinks: section.socialLinks?.length ? section.socialLinks : FALLBACK.socialLinks,
  };
}

const Footer = () => {
  const [data, setData] = useState(() => buildFooterState(null));

  const apiUrl = useMemo(() => `${getBackendBaseUrl()}/api/fetch-home-section/${SECTION_KEY}`, []);

  useEffect(() => {
    let isMounted = true;

    const fetchFooter = async () => {
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        if (isMounted && json?.success) {
          setData(buildFooterState(json.section));
        }
      } catch {
        if (isMounted) setData(buildFooterState(null));
      }
    };

    fetchFooter();
    return () => {
      isMounted = false;
    };
  }, [apiUrl]);

  return (
    <footer id="footer-area" className="padding-all">
      <div className="container">
        <div className="footer-widgets-area">
          <div className="footer-menu-1 footer-menu">
            <h5 className="footer-heading">{data.column1Title}</h5>
            {data.column1Links.map((link, index) => (
              <p key={`${link.url}-${index}`}>
                <FooterNavLink url={link.url}>{link.title}</FooterNavLink>
              </p>
            ))}
          </div>

          <div className="footer-logo-animation">
            <div className="animation-img">
              <img src={data.logoImage} alt="My Summerbody Club" />
              <div className="text-content">
                <p>{data.legalText}</p>
              </div>
            </div>
          </div>

          <div className="footer-facebook-profile">
            <ul id="sidebar">
              <li>
                <FacebookPagePlugin pageUrl={data.facebookPageUrl} noScroll height={340} />
              </li>
              <li>
                <FooterSocialLinks socialLinks={data.socialLinks} />
              </li>
            </ul>
          </div>

          <div className="footer-menu-2 footer-menu">
            <h5 className="footer-heading">{data.column4Title}</h5>
            <ul id="menu-footer-menu-2">
              {data.column4Links.map((link, index) => (
                <li key={`${link.url}-${index}`} className="menu-item">
                  <p>
                    <FooterNavLink url={link.url}>{link.title}</FooterNavLink>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
