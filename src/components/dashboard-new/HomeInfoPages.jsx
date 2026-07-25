import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { CheckCircle2, AlertCircle, ChevronDown, ChevronRight, Plus, Trash2, Save, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { getBackendBaseUrl } from "../../utils/backend";

const INFORMATIE_KEY = "informatie-page";
const PROEFLES_KEY = "proefles-page";

const DEFAULT_INFORMATIE = {
  pageHeading: "Ik wil graag meer informatie over:",
  gegevensHeading: "Mijn gegevens",
  introText:
    "Je ontvangt de informatie over de door jouw aangevraagde training zo snel mogelijk! Vul eerst nog even je gegevens in.",
  personalHeading: "Persoonlijke gegevens",
  contactHeading: "Contactgegevens",
  trainingOptions: [
    { title: "Small Group Training", amount: "small-group-training" },
    { title: "Personal Training", amount: "personal-training" },
    { title: "Duo PT", amount: "duo-pt" },
    { title: "Wedstrijd Training", amount: "wedstrijd-training" },
    { title: "Afvallen", amount: "afvallen" },
  ],
};

const DEFAULT_PROEFLES = {
  pageHeading: "Ik wil een afspraak maken voor proefles:",
  dayTimeHeading: "Kies dag & tijd",
  dayLabel: "Proefles dag",
  timeLabel: "Verzoektijd",
  noticeText: "Let op! Je krijgt een bevestiging of de door jouw gekozen tijdstip vrij is voor een proefles.",
  gegevensHeading: "Mijn gegevens",
  introText: "Je ontvang de informatie over de door jouw aangevraade trainen zo snel mogelijk!",
  personalHeading: "Persoonlijke gegevens",
  contactHeading: "Contactgegevens",
  confirmText: "Je bevestiging ontvang je op dit e-mailadres",
  trainingOptions: [
    { title: "Small Group Training (Gratis)", amount: "small-group-training" },
    { title: "Personal Training (Betaald) *", amount: "personal-training" },
    { title: "Duo PT (Betaald) *", amount: "duo-pt" },
    { title: "Wedstrijd Training (Betaald) *", amount: "wedstrijd-training" },
    { title: "Afvallen (Betaald) *", amount: "afvallen" },
  ],
  dayOptions: [
    { title: "Ma", amount: "ma" },
    { title: "Di", amount: "di" },
    { title: "Wo", amount: "wo" },
    { title: "Do", amount: "do" },
    { title: "Vr", amount: "vr" },
    { title: "Za", amount: "za" },
  ],
  timeOptions: [
    { title: "07:30-08:30", amount: "07-30-08-30" },
    { title: "08:30-09:30", amount: "08-30-09-30" },
    { title: "09:30-10:30", amount: "09-30-10-30" },
    { title: "10:30-11:30", amount: "10-30-11-30" },
    { title: "16:00-17:00", amount: "16-00-17-00" },
    { title: "18:00-19:00", amount: "18-00-19-00" },
  ],
};

function authHeaders() {
  try {
    const raw = localStorage.getItem("msbc_dashboard_auth");
    const token = raw ? JSON.parse(raw)?.token : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#ef4d16]";

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanOptions(options) {
  return (Array.isArray(options) ? options : [])
    .map((item) => ({
      title: String(item?.title || "").trim(),
      amount: String(item?.amount || "").trim() || slugify(item?.title),
    }))
    .filter((item) => item.title);
}

function linksToOptions(links, fallback) {
  if (!Array.isArray(links) || !links.length) return fallback;
  const mapped = links
    .slice()
    .sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0))
    .map((item) => ({
      title: String(item?.title || "").trim(),
      amount: String(item?.url || "").trim() || slugify(item?.title),
    }))
    .filter((item) => item.title);
  return mapped.length ? mapped : fallback;
}

function optionsToLinks(options) {
  return cleanOptions(options).map((item, index) => ({
    title: item.title,
    url: item.amount,
    displayOrder: index,
  }));
}

function galleryToOptions(items, fallback) {
  if (!Array.isArray(items) || !items.length) return fallback;
  const mapped = items
    .slice()
    .sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0))
    .map((item) => ({
      title: String(item?.imageUrl || "").trim(),
      amount: String(item?.linkUrl || "").trim() || slugify(item?.imageUrl),
    }))
    .filter((item) => item.title);
  return mapped.length ? mapped : fallback;
}

function optionsToGallery(options) {
  return cleanOptions(options).map((item, index) => ({
    imageUrl: item.title,
    imagePublicId: "",
    linkUrl: item.amount,
    displayOrder: index,
  }));
}

function parseProeflesBody(bodyText) {
  if (!bodyText || typeof bodyText !== "string") return {};
  try {
    const parsed = JSON.parse(bodyText);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return { noticeText: bodyText };
  }
}

function VisibilityToggle({ visible, saving, onToggle }) {
  return (
    <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        role="switch"
        aria-checked={visible}
        disabled={saving}
        onClick={onToggle}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#ef4d16] focus:ring-offset-2 disabled:opacity-60 ${
          visible ? "bg-[#ef4d16]" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            visible ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <span className={`text-xs font-medium w-7 ${visible ? "text-green-600" : "text-gray-400"}`}>
        {visible ? "Aan" : "Uit"}
      </span>
    </div>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <label className={`block space-y-1 ${className}`}>
      <span className="block text-xs font-medium text-gray-600">{label}</span>
      {children}
    </label>
  );
}

function OptionsEditor({ lang, title, hint, options, onChange, addLabel, titlePlaceholder, valuePlaceholder }) {
  const update = (index, patch) => {
    onChange(options.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-sm font-semibold text-gray-800">{title}</div>
          {hint && <div className="text-xs text-gray-500">{hint}</div>}
        </div>
        <Button variant="outline" className="rounded-xl" onClick={() => onChange([...options, { title: "", amount: "" }])}>
          <Plus className="w-4 h-4 mr-2" />
          {addLabel}
        </Button>
      </div>
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={index} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end">
            <Field label={lang === "nl" ? "Titel" : "Title"} className="flex-1">
              <input
                className={inputCls}
                value={option.title}
                onChange={(e) => {
                  const nextTitle = e.target.value;
                  update(index, {
                    title: nextTitle,
                    amount: option.amount || slugify(nextTitle),
                  });
                }}
                placeholder={titlePlaceholder}
              />
            </Field>
            <Field label={lang === "nl" ? "Waarde" : "Value"} className="sm:w-56">
              <input
                className={inputCls}
                value={option.amount}
                onChange={(e) => update(index, { amount: slugify(e.target.value) || e.target.value })}
                placeholder={valuePlaceholder}
              />
            </Field>
            <button
              type="button"
              className="text-red-600 hover:bg-red-50 rounded-lg p-2 h-10 self-end"
              onClick={() => onChange(options.filter((_, i) => i !== index))}
              aria-label="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {options.length === 0 && (
          <div className="text-sm text-gray-500">{lang === "nl" ? "Nog geen opties." : "No options yet."}</div>
        )}
      </div>
    </div>
  );
}

export default function HomeInfoPages({ lang = "nl", embedded = false }) {
  const backendBase = useMemo(() => getBackendBaseUrl(), []);
  const [expandedKey, setExpandedKey] = useState(null);

  const [informatieVisible, setInformatieVisible] = useState(true);
  const [proeflesVisible, setProeflesVisible] = useState(true);
  const [toggleSavingKey, setToggleSavingKey] = useState("");

  const [pageHeading, setPageHeading] = useState(DEFAULT_INFORMATIE.pageHeading);
  const [gegevensHeading, setGegevensHeading] = useState(DEFAULT_INFORMATIE.gegevensHeading);
  const [introText, setIntroText] = useState(DEFAULT_INFORMATIE.introText);
  const [personalHeading, setPersonalHeading] = useState(DEFAULT_INFORMATIE.personalHeading);
  const [contactHeading, setContactHeading] = useState(DEFAULT_INFORMATIE.contactHeading);
  const [trainingOptions, setTrainingOptions] = useState(DEFAULT_INFORMATIE.trainingOptions);

  const [proeflesPageHeading, setProeflesPageHeading] = useState(DEFAULT_PROEFLES.pageHeading);
  const [proeflesDayTimeHeading, setProeflesDayTimeHeading] = useState(DEFAULT_PROEFLES.dayTimeHeading);
  const [proeflesDayLabel, setProeflesDayLabel] = useState(DEFAULT_PROEFLES.dayLabel);
  const [proeflesTimeLabel, setProeflesTimeLabel] = useState(DEFAULT_PROEFLES.timeLabel);
  const [proeflesNoticeText, setProeflesNoticeText] = useState(DEFAULT_PROEFLES.noticeText);
  const [proeflesGegevensHeading, setProeflesGegevensHeading] = useState(DEFAULT_PROEFLES.gegevensHeading);
  const [proeflesIntroText, setProeflesIntroText] = useState(DEFAULT_PROEFLES.introText);
  const [proeflesPersonalHeading, setProeflesPersonalHeading] = useState(DEFAULT_PROEFLES.personalHeading);
  const [proeflesContactHeading, setProeflesContactHeading] = useState(DEFAULT_PROEFLES.contactHeading);
  const [proeflesConfirmText, setProeflesConfirmText] = useState(DEFAULT_PROEFLES.confirmText);
  const [proeflesTrainingOptions, setProeflesTrainingOptions] = useState(DEFAULT_PROEFLES.trainingOptions);
  const [proeflesDayOptions, setProeflesDayOptions] = useState(DEFAULT_PROEFLES.dayOptions);
  const [proeflesTimeOptions, setProeflesTimeOptions] = useState(DEFAULT_PROEFLES.timeOptions);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const applyInformatieSection = (section) => {
    if (!section) return;
    setInformatieVisible(section.isActive !== false);
    setPageHeading(section.title || DEFAULT_INFORMATIE.pageHeading);
    setGegevensHeading(section.buttonLabel || DEFAULT_INFORMATIE.gegevensHeading);
    setIntroText(section.bodyText || DEFAULT_INFORMATIE.introText);
    setPersonalHeading(section.footerColumn1Title || DEFAULT_INFORMATIE.personalHeading);
    setContactHeading(section.footerColumn4Title || DEFAULT_INFORMATIE.contactHeading);
    setTrainingOptions(linksToOptions(section.footerColumn1Links, DEFAULT_INFORMATIE.trainingOptions));
  };

  const applyProeflesSection = (section) => {
    if (!section) return;
    const extra = parseProeflesBody(section.bodyText);
    setProeflesVisible(section.isActive !== false);
    setProeflesPageHeading(section.title || DEFAULT_PROEFLES.pageHeading);
    setProeflesDayTimeHeading(section.buttonLabel || extra.dayTimeHeading || DEFAULT_PROEFLES.dayTimeHeading);
    setProeflesDayLabel(section.photosButtonUrl || extra.dayLabel || DEFAULT_PROEFLES.dayLabel);
    setProeflesTimeLabel(section.videosButtonUrl || extra.timeLabel || DEFAULT_PROEFLES.timeLabel);
    setProeflesNoticeText(extra.noticeText || DEFAULT_PROEFLES.noticeText);
    setProeflesGegevensHeading(section.footerColumn1Title || extra.gegevensHeading || DEFAULT_PROEFLES.gegevensHeading);
    setProeflesIntroText(section.footerLegalText || extra.introText || DEFAULT_PROEFLES.introText);
    setProeflesPersonalHeading(section.footerColumn4Title || extra.personalHeading || DEFAULT_PROEFLES.personalHeading);
    setProeflesContactHeading(section.buttonUrl || extra.contactHeading || DEFAULT_PROEFLES.contactHeading);
    setProeflesConfirmText(extra.confirmText || DEFAULT_PROEFLES.confirmText);
    setProeflesTrainingOptions(linksToOptions(section.footerColumn1Links, DEFAULT_PROEFLES.trainingOptions));
    setProeflesDayOptions(linksToOptions(section.footerColumn4Links, DEFAULT_PROEFLES.dayOptions));
    setProeflesTimeOptions(galleryToOptions(section.galleryItems, DEFAULT_PROEFLES.timeOptions));
  };

  const load = async () => {
    try {
      setLoading(true);
      setStatus(null);
      const [infoRes, proefRes] = await Promise.all([
        axios.get(`${backendBase}/api/fetch-home-section/${INFORMATIE_KEY}`),
        axios.get(`${backendBase}/api/fetch-home-section/${PROEFLES_KEY}`),
      ]);
      if (infoRes.data?.success && infoRes.data.section) applyInformatieSection(infoRes.data.section);
      if (proefRes.data?.success && proefRes.data.section) applyProeflesSection(proefRes.data.section);
    } catch (e) {
      setStatus({
        type: "err",
        text: e?.response?.data?.error || e?.message || "Laden mislukt",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [backendBase]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleVisibility = async ({ sectionKey, visible, setVisible, label }) => {
    const next = !visible;
    try {
      setToggleSavingKey(sectionKey);
      setStatus(null);
      await axios.put(
        `${backendBase}/api/home-sections/${sectionKey}`,
        { isActive: next },
        { headers: { "Content-Type": "application/json", ...authHeaders() } }
      );
      setVisible(next);
      setStatus({
        type: "ok",
        text:
          lang === "nl"
            ? `${label} is nu ${next ? "zichtbaar" : "verborgen"} op de homepage.`
            : `${label} is now ${next ? "visible" : "hidden"} on the homepage.`,
      });
    } catch (e) {
      setStatus({
        type: "err",
        text: e?.response?.data?.error || e?.message || "Toggle mislukt",
      });
    } finally {
      setToggleSavingKey("");
    }
  };

  const saveInformatie = async () => {
    const cleaned = cleanOptions(trainingOptions);
    if (!cleaned.length) {
      setStatus({
        type: "err",
        text: lang === "nl" ? "Voeg minstens één training optie toe." : "Add at least one training option.",
      });
      return;
    }

    try {
      setSaving(true);
      setStatus(null);
      await axios.put(
        `${backendBase}/api/home-sections/${INFORMATIE_KEY}`,
        {
          title: pageHeading.trim() || DEFAULT_INFORMATIE.pageHeading,
          bodyText: introText.trim() || DEFAULT_INFORMATIE.introText,
          buttonLabel: gegevensHeading.trim() || DEFAULT_INFORMATIE.gegevensHeading,
          footerColumn1Title: personalHeading.trim() || DEFAULT_INFORMATIE.personalHeading,
          footerColumn4Title: contactHeading.trim() || DEFAULT_INFORMATIE.contactHeading,
          footerColumn1Links: optionsToLinks(cleaned),
          isActive: informatieVisible,
        },
        { headers: { "Content-Type": "application/json", ...authHeaders() } }
      );
      setTrainingOptions(cleaned);
      setStatus({
        type: "ok",
        text: lang === "nl" ? "Informatie pagina opgeslagen." : "Informatie page saved.",
      });
    } catch (e) {
      setStatus({
        type: "err",
        text: e?.response?.data?.error || e?.message || "Opslaan mislukt",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveProefles = async () => {
    const cleanedTraining = cleanOptions(proeflesTrainingOptions);
    const cleanedDays = cleanOptions(proeflesDayOptions);
    const cleanedTimes = cleanOptions(proeflesTimeOptions);

    if (!cleanedTraining.length || !cleanedDays.length || !cleanedTimes.length) {
      setStatus({
        type: "err",
        text:
          lang === "nl"
            ? "Voeg minstens één optie toe bij training, dagen en tijden."
            : "Add at least one option for training, days and times.",
      });
      return;
    }

    try {
      setSaving(true);
      setStatus(null);
      await axios.put(
        `${backendBase}/api/home-sections/${PROEFLES_KEY}`,
        {
          title: proeflesPageHeading.trim() || DEFAULT_PROEFLES.pageHeading,
          buttonLabel: proeflesDayTimeHeading.trim() || DEFAULT_PROEFLES.dayTimeHeading,
          photosButtonUrl: proeflesDayLabel.trim() || DEFAULT_PROEFLES.dayLabel,
          videosButtonUrl: proeflesTimeLabel.trim() || DEFAULT_PROEFLES.timeLabel,
          footerColumn1Title: proeflesGegevensHeading.trim() || DEFAULT_PROEFLES.gegevensHeading,
          footerLegalText: proeflesIntroText.trim() || DEFAULT_PROEFLES.introText,
          footerColumn4Title: proeflesPersonalHeading.trim() || DEFAULT_PROEFLES.personalHeading,
          buttonUrl: proeflesContactHeading.trim() || DEFAULT_PROEFLES.contactHeading,
          bodyText: JSON.stringify({
            noticeText: proeflesNoticeText.trim() || DEFAULT_PROEFLES.noticeText,
            confirmText: proeflesConfirmText.trim() || DEFAULT_PROEFLES.confirmText,
          }),
          footerColumn1Links: optionsToLinks(cleanedTraining),
          footerColumn4Links: optionsToLinks(cleanedDays),
          galleryItems: optionsToGallery(cleanedTimes),
          isActive: proeflesVisible,
        },
        { headers: { "Content-Type": "application/json", ...authHeaders() } }
      );
      setProeflesTrainingOptions(cleanedTraining);
      setProeflesDayOptions(cleanedDays);
      setProeflesTimeOptions(cleanedTimes);
      setStatus({
        type: "ok",
        text: lang === "nl" ? "Proefles pagina opgeslagen." : "Proefles page saved.",
      });
    } catch (e) {
      setStatus({
        type: "err",
        text: e?.response?.data?.error || e?.message || "Opslaan mislukt",
      });
    } finally {
      setSaving(false);
    }
  };

  const optionHint =
    lang === "nl"
      ? "Titel = zichtbare tekst, Waarde = opgeslagen keuze in het formulier."
      : "Title = visible label, Value = stored form choice.";

  return (
    <div className={embedded ? "space-y-4 pt-2" : "space-y-4"}>
      {loading ? (
        <div className="text-sm text-gray-500">Laden…</div>
      ) : (
        <div className="space-y-3">
          {/* Informatie */}
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <button
              type="button"
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50"
              onClick={() => setExpandedKey((prev) => (prev === INFORMATIE_KEY ? null : INFORMATIE_KEY))}
              aria-expanded={expandedKey === INFORMATIE_KEY}
            >
              {expandedKey === INFORMATIE_KEY ? (
                <ChevronDown className="w-4 h-4 text-[#ef4d16] shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900">Informatie</div>
                <div className="text-xs text-gray-500">
                  {lang === "nl"
                    ? "Homepage banner + formulier opties op /informatie"
                    : "Homepage banner + form options on /informatie"}
                </div>
              </div>
              <VisibilityToggle
                visible={informatieVisible}
                saving={toggleSavingKey === INFORMATIE_KEY}
                onToggle={() =>
                  toggleVisibility({
                    sectionKey: INFORMATIE_KEY,
                    visible: informatieVisible,
                    setVisible: setInformatieVisible,
                    label: "Informatie",
                  })
                }
              />
            </button>

            {expandedKey === INFORMATIE_KEY && (
              <div className="border-t border-gray-100 px-4 py-4 space-y-4 bg-gray-50/60">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="text-sm font-semibold text-gray-800">Pagina inhoud</div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="rounded-xl" onClick={load} disabled={loading || saving}>
                      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                      {lang === "nl" ? "Verversen" : "Refresh"}
                    </Button>
                    <Button
                      className="rounded-xl bg-[#ef4d16] hover:bg-[#d23f0f] text-white"
                      onClick={saveInformatie}
                      disabled={saving}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? (lang === "nl" ? "Opslaan..." : "Saving...") : lang === "nl" ? "Opslaan" : "Save"}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <Field label={lang === "nl" ? "Hoofdtitel" : "Main heading"}>
                    <input className={inputCls} value={pageHeading} onChange={(e) => setPageHeading(e.target.value)} />
                  </Field>
                  <Field label={lang === "nl" ? "Kop 'Mijn gegevens'" : "'Mijn gegevens' heading"}>
                    <input className={inputCls} value={gegevensHeading} onChange={(e) => setGegevensHeading(e.target.value)} />
                  </Field>
                  <Field label={lang === "nl" ? "Tekst onder 'Mijn gegevens'" : "Text under 'Mijn gegevens'"}>
                    <textarea className={`${inputCls} min-h-[90px] resize-y`} value={introText} onChange={(e) => setIntroText(e.target.value)} />
                  </Field>
                  <Field label={lang === "nl" ? "Kop 'Persoonlijke gegevens'" : "'Persoonlijke gegevens' heading"}>
                    <input className={inputCls} value={personalHeading} onChange={(e) => setPersonalHeading(e.target.value)} />
                  </Field>
                  <Field label={lang === "nl" ? "Kop 'Contactgegevens'" : "'Contactgegevens' heading"}>
                    <input className={inputCls} value={contactHeading} onChange={(e) => setContactHeading(e.target.value)} />
                  </Field>
                </div>

                <OptionsEditor
                  lang={lang}
                  title={lang === "nl" ? "Training opties (radio)" : "Training options (radio)"}
                  hint={optionHint}
                  options={trainingOptions}
                  onChange={setTrainingOptions}
                  addLabel={lang === "nl" ? "Optie toevoegen" : "Add option"}
                  titlePlaceholder="Personal Training"
                  valuePlaceholder="personal-training"
                />
              </div>
            )}
          </div>

          {/* Proefles */}
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <button
              type="button"
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50"
              onClick={() => setExpandedKey((prev) => (prev === PROEFLES_KEY ? null : PROEFLES_KEY))}
              aria-expanded={expandedKey === PROEFLES_KEY}
            >
              {expandedKey === PROEFLES_KEY ? (
                <ChevronDown className="w-4 h-4 text-[#ef4d16] shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900">Proefles</div>
                <div className="text-xs text-gray-500">
                  {lang === "nl"
                    ? "Homepage banner + formulier opties op /proefles"
                    : "Homepage banner + form options on /proefles"}
                </div>
              </div>
              <VisibilityToggle
                visible={proeflesVisible}
                saving={toggleSavingKey === PROEFLES_KEY}
                onToggle={() =>
                  toggleVisibility({
                    sectionKey: PROEFLES_KEY,
                    visible: proeflesVisible,
                    setVisible: setProeflesVisible,
                    label: "Proefles",
                  })
                }
              />
            </button>

            {expandedKey === PROEFLES_KEY && (
              <div className="border-t border-gray-100 px-4 py-4 space-y-4 bg-gray-50/60">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="text-sm font-semibold text-gray-800">Pagina inhoud</div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="rounded-xl" onClick={load} disabled={loading || saving}>
                      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                      {lang === "nl" ? "Verversen" : "Refresh"}
                    </Button>
                    <Button
                      className="rounded-xl bg-[#ef4d16] hover:bg-[#d23f0f] text-white"
                      onClick={saveProefles}
                      disabled={saving}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? (lang === "nl" ? "Opslaan..." : "Saving...") : lang === "nl" ? "Opslaan" : "Save"}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <Field label={lang === "nl" ? "Hoofdtitel" : "Main heading"}>
                    <input className={inputCls} value={proeflesPageHeading} onChange={(e) => setProeflesPageHeading(e.target.value)} />
                  </Field>
                  <Field label={lang === "nl" ? "Kop 'Kies dag & tijd'" : "'Kies dag & tijd' heading"}>
                    <input className={inputCls} value={proeflesDayTimeHeading} onChange={(e) => setProeflesDayTimeHeading(e.target.value)} />
                  </Field>
                  <Field label={lang === "nl" ? "Label dagen" : "Days label"}>
                    <input className={inputCls} value={proeflesDayLabel} onChange={(e) => setProeflesDayLabel(e.target.value)} />
                  </Field>
                  <Field label={lang === "nl" ? "Label tijden" : "Times label"}>
                    <input className={inputCls} value={proeflesTimeLabel} onChange={(e) => setProeflesTimeLabel(e.target.value)} />
                  </Field>
                  <Field label={lang === "nl" ? "Let-op tekst" : "Notice text"}>
                    <textarea
                      className={`${inputCls} min-h-[80px] resize-y`}
                      value={proeflesNoticeText}
                      onChange={(e) => setProeflesNoticeText(e.target.value)}
                    />
                  </Field>
                  <Field label={lang === "nl" ? "Kop 'Mijn gegevens'" : "'Mijn gegevens' heading"}>
                    <input className={inputCls} value={proeflesGegevensHeading} onChange={(e) => setProeflesGegevensHeading(e.target.value)} />
                  </Field>
                  <Field label={lang === "nl" ? "Tekst onder 'Mijn gegevens'" : "Text under 'Mijn gegevens'"}>
                    <textarea
                      className={`${inputCls} min-h-[80px] resize-y`}
                      value={proeflesIntroText}
                      onChange={(e) => setProeflesIntroText(e.target.value)}
                    />
                  </Field>
                  <Field label={lang === "nl" ? "Kop 'Persoonlijke gegevens'" : "'Persoonlijke gegevens' heading"}>
                    <input className={inputCls} value={proeflesPersonalHeading} onChange={(e) => setProeflesPersonalHeading(e.target.value)} />
                  </Field>
                  <Field label={lang === "nl" ? "Kop 'Contactgegevens'" : "'Contactgegevens' heading"}>
                    <input className={inputCls} value={proeflesContactHeading} onChange={(e) => setProeflesContactHeading(e.target.value)} />
                  </Field>
                  <Field label={lang === "nl" ? "Bevestigingstekst bij e-mail" : "Email confirmation text"}>
                    <input className={inputCls} value={proeflesConfirmText} onChange={(e) => setProeflesConfirmText(e.target.value)} />
                  </Field>
                </div>

                <OptionsEditor
                  lang={lang}
                  title={lang === "nl" ? "Training opties (radio)" : "Training options (radio)"}
                  hint={optionHint}
                  options={proeflesTrainingOptions}
                  onChange={setProeflesTrainingOptions}
                  addLabel={lang === "nl" ? "Optie toevoegen" : "Add option"}
                  titlePlaceholder="Personal Training (Betaald) *"
                  valuePlaceholder="personal-training"
                />
                <OptionsEditor
                  lang={lang}
                  title={lang === "nl" ? "Dagen (radio)" : "Days (radio)"}
                  hint={optionHint}
                  options={proeflesDayOptions}
                  onChange={setProeflesDayOptions}
                  addLabel={lang === "nl" ? "Dag toevoegen" : "Add day"}
                  titlePlaceholder="Ma"
                  valuePlaceholder="ma"
                />
                <OptionsEditor
                  lang={lang}
                  title={lang === "nl" ? "Tijden (radio)" : "Times (radio)"}
                  hint={optionHint}
                  options={proeflesTimeOptions}
                  onChange={setProeflesTimeOptions}
                  addLabel={lang === "nl" ? "Tijd toevoegen" : "Add time"}
                  titlePlaceholder="07:30-08:30"
                  valuePlaceholder="07-30-08-30"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {status && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm inline-flex items-center gap-2 ${
            status.type === "ok" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {status.type === "ok" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {status.text}
        </div>
      )}
    </div>
  );
}
