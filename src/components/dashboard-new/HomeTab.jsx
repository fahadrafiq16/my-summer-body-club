import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import HomePageSlider from "./HomePageSlider";
import HomeLifeStyle from "./HomeLifeStyle";
import HomePopUpVideo from "./HomePopUpVideo";
import HomeGallery from "./HomeGallery";
import HomeFooter from "./HomeFooter";
import HomePageHeroImage from "./HomePageHeroImage";
import HomeOverMsbc from "./HomeOverMsbc";
import HomeAbonnement from "./HomeAbonnement";

const SECTIONS = [
  {
    key: "slider",
    labelNl: "Home Page Slider",
    labelEn: "Home Page Slider",
    descriptionNl: "Homepage slides — afbeeldingen via Cloudinary, data in MongoDB.",
    descriptionEn: "Homepage slides — images via Cloudinary, data in MongoDB.",
    render: (lang) => <HomePageSlider lang={lang} embedded />,
  },
  {
    key: "lifestyle",
    labelNl: "Begin Een Nieuwe Life Style",
    labelEn: "Begin Een Nieuwe Life Style",
    descriptionNl: "YouTube-video en banner voor de lifestyle-sectie op de homepage.",
    descriptionEn: "YouTube video and banner for the lifestyle section on the homepage.",
    render: (lang) => <HomeLifeStyle lang={lang} embedded />,
  },
  {
    key: "popup-video",
    labelNl: "Popup Video Area",
    labelEn: "Popup Video Area",
    descriptionNl: "Linker/rechter banner en popup YouTube-video op de homepage.",
    descriptionEn: "Left/right banners and popup YouTube video on the homepage.",
    render: (lang) => <HomePopUpVideo lang={lang} embedded />,
  },
  {
    key: "gallery",
    labelNl: "Gallery",
    labelEn: "Gallery",
    descriptionNl: "Photos/Videos knoppen en 5 gallery-afbeeldingen met links.",
    descriptionEn: "Photos/Videos buttons and 5 gallery images with links.",
    render: (lang) => <HomeGallery lang={lang} embedded />,
  },
  {
    key: "footer",
    labelNl: "Footer",
    labelEn: "Footer",
    descriptionNl: "4 kolommen: menu's, logo, Facebook feed en social media links.",
    descriptionEn: "4 columns: menus, logo, Facebook feed and social media links.",
    render: (lang) => <HomeFooter lang={lang} embedded />,
  },
  {
    key: "over-msbc",
    labelNl: "Over MSBC",
    labelEn: "Over MSBC",
    descriptionNl: "Slider-afbeeldingen rechts op de Over MSBC-pagina (/over-msbc).",
    descriptionEn: "Slider images on the right side of the Over MSBC page (/over-msbc).",
    render: (lang) => <HomeOverMsbc lang={lang} embedded />,
  },
  {
    key: "abonnement",
    labelNl: "Abonnement",
    labelEn: "Abonnement",
    descriptionNl: "Banner op de Abonnement-pagina: titel, tekst, knop en afbeelding (/abonnement).",
    descriptionEn: "Banner on the Abonnement page: title, text, button and image (/abonnement).",
    render: (lang) => <HomeAbonnement lang={lang} embedded />,
  },
  {
    key: "bootcamp",
    labelNl: "Bootcamp",
    labelEn: "Bootcamp",
    descriptionNl: "Hero-afbeelding op de Bootcamp-pagina (/bootcamp).",
    descriptionEn: "Hero image on the Bootcamp page (/bootcamp).",
    render: (lang) => (
      <HomePageHeroImage
        sectionKey="bootcamp-page"
        title="Bootcamp"
        uploadFolder="msbc/bootcamp"
        lang={lang}
        embedded
        hintNl="Wordt getoond rechts op de Bootcamp-pagina."
        hintEn="Shown on the right side of the Bootcamp page."
      />
    ),
  },
  {
    key: "pt-rent",
    labelNl: "PT Ruimte Huren",
    labelEn: "PT Ruimte Huren",
    descriptionNl: "Hero-afbeelding op de PT Ruimte Huren-pagina (/pt-ruimte-huren).",
    descriptionEn: "Hero image on the PT Ruimte Huren page (/pt-ruimte-huren).",
    render: (lang) => (
      <HomePageHeroImage
        sectionKey="pt-rent-page"
        title="PT Ruimte Huren"
        uploadFolder="msbc/pt-rent"
        lang={lang}
        embedded
        hintNl="Wordt getoond onder de kop op de PT Ruimte Huren-pagina."
        hintEn="Shown below the headline on the PT Ruimte Huren page."
      />
    ),
  },
];

function HomeSectionAccordion({ section, lang, expanded, onToggle }) {
  const label = lang === "nl" ? section.labelNl : section.labelEn;
  const description = lang === "nl" ? section.descriptionNl : section.descriptionEn;

  return (
    <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={expanded}
      >
        {expanded ? (
          <ChevronDown className="w-5 h-5 shrink-0 text-[#ef4d16]" />
        ) : (
          <ChevronRight className="w-5 h-5 shrink-0 text-gray-400" />
        )}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900">{label}</div>
          {!expanded && description && (
            <div className="text-sm text-gray-500 mt-0.5 truncate">{description}</div>
          )}
        </div>
      </button>

      {expanded && (
        <CardContent className="px-5 pb-5 pt-0 border-t border-gray-100">
          {description && (
            <p className="text-sm text-gray-500 mb-4 pt-4">{description}</p>
          )}
          {section.render(lang)}
        </CardContent>
      )}
    </Card>
  );
}

export default function HomeTab({ lang = "nl" }) {
  const [expandedKeys, setExpandedKeys] = useState(() => new Set());

  const toggleSection = (key) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-bold">Home</div>
        <div className="text-sm text-gray-500">
          {lang === "nl"
            ? "Beheer homepage inhoud — klap een sectie open om te bewerken."
            : "Manage homepage content — expand a section to edit."}
        </div>
      </div>

      <div className="space-y-3">
        {SECTIONS.map((section) => (
          <HomeSectionAccordion
            key={section.key}
            section={section}
            lang={lang}
            expanded={expandedKeys.has(section.key)}
            onToggle={() => toggleSection(section.key)}
          />
        ))}
      </div>
    </div>
  );
}
