import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronRight, GripVertical } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import HomePageSlider from "./HomePageSlider";
import HomeLifeStyle from "./HomeLifeStyle";
import HomePopUpVideo from "./HomePopUpVideo";
import HomeGallery from "./HomeGallery";
import HomeFooter from "./HomeFooter";
import HomePageHeroImage from "./HomePageHeroImage";
import HomeOverMsbc from "./HomeOverMsbc";
import HomeAbonnement from "./HomeAbonnement";
import HomeInfoPages from "./HomeInfoPages";
import { getBackendBaseUrl } from "../../utils/backend";

const ORDER_SECTION_KEY = "website-home-order";
const ORDER_CACHE_KEY = "msbc_website_home_section_order";

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
    descriptionNl: "Gallery-afbeeldingen, links en video's uploaden.",
    descriptionEn: "Gallery images, links and video uploads.",
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
  {
    key: "info-pages",
    labelNl: "Info Pages",
    labelEn: "Info Pages",
    descriptionNl: "Toon of verberg de Informatie- en Proefles-banners op de homepage.",
    descriptionEn: "Show or hide the Informatie and Proefles banners on the homepage.",
    render: (lang) => <HomeInfoPages lang={lang} embedded />,
  },
];

const DEFAULT_ORDER = SECTIONS.map((s) => s.key);
const SECTION_BY_KEY = Object.fromEntries(SECTIONS.map((s) => [s.key, s]));

function authHeaders() {
  try {
    const raw = localStorage.getItem("msbc_dashboard_auth");
    const token = raw ? JSON.parse(raw)?.token : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

function normalizeOrder(keys) {
  const seen = new Set();
  const next = [];
  if (Array.isArray(keys)) {
    keys.forEach((key) => {
      if (SECTION_BY_KEY[key] && !seen.has(key)) {
        seen.add(key);
        next.push(key);
      }
    });
  }
  DEFAULT_ORDER.forEach((key) => {
    if (!seen.has(key)) next.push(key);
  });
  return next;
}

function readCachedOrder() {
  try {
    const raw = localStorage.getItem(ORDER_CACHE_KEY);
    if (!raw) return null;
    return normalizeOrder(JSON.parse(raw));
  } catch {
    return null;
  }
}

function writeCachedOrder(order) {
  try {
    localStorage.setItem(ORDER_CACHE_KEY, JSON.stringify(order));
  } catch {
    /* ignore */
  }
}

function HomeSectionAccordion({
  section,
  lang,
  expanded,
  onToggle,
  isDragging,
  isDragOver,
  onDragOver,
  onDrop,
  onDragLeave,
  onDragStart,
  onDragEnd,
}) {
  const label = lang === "nl" ? section.labelNl : section.labelEn;
  const description = lang === "nl" ? section.descriptionNl : section.descriptionEn;

  return (
    <Card
      className={`bg-white shadow-sm border rounded-2xl overflow-hidden transition-all ${
        isDragging
          ? "opacity-50 border-[#ef4d16] border-dashed"
          : isDragOver
          ? "border-[#ef4d16] ring-2 ring-[#ef4d16]/20"
          : "border-gray-200"
      }`}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
    >
      <div className="flex items-stretch">
        <div
          draggable
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          className="flex items-center px-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 hover:bg-gray-50 select-none"
          title={lang === "nl" ? "Sleep om te herordenen" : "Drag to reorder"}
          aria-label={lang === "nl" ? "Sleep om te herordenen" : "Drag to reorder"}
        >
          <GripVertical className="w-5 h-5 pointer-events-none" />
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="flex-1 flex items-center gap-3 px-3 py-4 text-left hover:bg-gray-50 transition-colors"
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
      </div>

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
  const backendBase = useMemo(() => getBackendBaseUrl(), []);
  const [expandedKeys, setExpandedKeys] = useState(() => new Set());
  const [sectionOrder, setSectionOrder] = useState(() => readCachedOrder() || DEFAULT_ORDER);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadOrder = async () => {
      try {
        const res = await axios.get(`${backendBase}/api/fetch-home-section/${ORDER_SECTION_KEY}`);
        if (!isMounted || !res.data?.success) return;
        const raw = res.data.section?.bodyText;
        if (!raw) return;
        const parsed = JSON.parse(raw);
        const next = normalizeOrder(parsed);
        setSectionOrder(next);
        writeCachedOrder(next);
      } catch {
        /* keep cached/default order */
      }
    };
    loadOrder();
    return () => {
      isMounted = false;
    };
  }, [backendBase]);

  const toggleSection = (key) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const persistOrder = async (order) => {
    writeCachedOrder(order);
    try {
      await axios.put(
        `${backendBase}/api/home-sections/${ORDER_SECTION_KEY}`,
        {
          title: "Website Home Section Order",
          bodyText: JSON.stringify(order),
        },
        { headers: { "Content-Type": "application/json", ...authHeaders() } }
      );
    } catch {
      /* local order still applied */
    }
  };

  const reorderSections = (fromIndex, toIndex) => {
    if (fromIndex == null || toIndex == null || fromIndex === toIndex) return;
    setSectionOrder((prev) => {
      if (fromIndex < 0 || toIndex < 0 || fromIndex >= prev.length || toIndex >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      persistOrder(next);
      return next;
    });
  };

  const orderedSections = sectionOrder.map((key) => SECTION_BY_KEY[key]).filter(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-bold">Home</div>
        <div className="text-sm text-gray-500">
          {lang === "nl"
            ? "Beheer homepage inhoud — sleep secties om te herordenen, klap open om te bewerken."
            : "Manage homepage content — drag sections to reorder, expand to edit."}
        </div>
      </div>

      <div className="space-y-3">
        {orderedSections.map((section, idx) => (
          <HomeSectionAccordion
            key={section.key}
            section={section}
            lang={lang}
            expanded={expandedKeys.has(section.key)}
            onToggle={() => toggleSection(section.key)}
            isDragging={dragIndex === idx}
            isDragOver={dragOverIndex === idx}
            onDragOver={(e) => {
              e.preventDefault();
              if (dragIndex !== null && dragIndex !== idx) setDragOverIndex(idx);
            }}
            onDrop={(e) => {
              e.preventDefault();
              reorderSections(dragIndex, idx);
              setDragIndex(null);
              setDragOverIndex(null);
            }}
            onDragLeave={() => {
              if (dragOverIndex === idx) setDragOverIndex(null);
            }}
            onDragStart={(e) => {
              setDragIndex(idx);
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData("text/plain", String(idx));
            }}
            onDragEnd={() => {
              setDragIndex(null);
              setDragOverIndex(null);
            }}
          />
        ))}
      </div>
    </div>
  );
}
