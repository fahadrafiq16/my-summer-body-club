import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import { Plus, Trash2, Save, RefreshCw, CheckCircle2, AlertCircle, ImageIcon } from "lucide-react";
import { getBackendBaseUrl } from "../../utils/backend";
import { PLATFORM_LABELS } from "../footer/FooterSocialLinks";

const SECTION_KEY = "footer";

const DEFAULT_COLUMN1_TITLE = "Onze Trainingen";
const DEFAULT_COLUMN4_TITLE = "Info & Service";
const DEFAULT_LEGAL_TEXT = "Algemene voorwaarden | Privacybeleid | KVK 59250097 | Btw: NL003699102B10";
const DEFAULT_FACEBOOK_PAGE = "https://www.facebook.com/mysummerbodyclub";

const DEFAULT_COLUMN1_LINKS = [
  { title: "Kies Afvallen", url: "/trainingprograms/afvallen-training/" },
  { title: "Kies Groep PT", url: "/trainingprograms/groeppt-training/" },
  { title: "Kies Personal Training", url: "/trainingprograms/personal-training/" },
  { title: "Kies Wedstrijd Training", url: "/trainingprograms/wedstrijd-training/" },
];

const DEFAULT_COLUMN4_LINKS = [
  { title: "Algemene voorwaarden", url: "/algemene-voorwaarden/" },
  { title: "Privacyverklaring", url: "/privacyverklaring/" },
];

const DEFAULT_SOCIAL = [
  { platform: "facebook", url: "https://www.facebook.com/mysummerbodyclub/" },
  { platform: "instagram", url: "https://www.instagram.com/mysummerbodyclub/" },
  { platform: "pinterest", url: "https://pinterest.com/mysummerbodyclub/" },
  { platform: "youtube", url: "https://www.youtube.com/@mysummerbodyclub" },
];

const SOCIAL_PLATFORMS = ["facebook", "instagram", "pinterest", "youtube"];

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

function emptyLink() {
  return { title: "", url: "" };
}

function MenuLinksEditor({ label, links, onChange, disabled }) {
  const items = Array.isArray(links) ? links : [];

  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-gray-800">{label}</div>
      {items.map((link, index) => (
        <div key={index} className="rounded-xl border border-gray-200 p-3 bg-gray-50 grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 items-end">
          <label className="block">
            <span className="block text-xs font-medium text-gray-600 mb-1">Titel</span>
            <input
              className={inputCls}
              value={link.title || ""}
              disabled={disabled}
              onChange={(e) => {
                const next = [...items];
                next[index] = { ...next[index], title: e.target.value };
                onChange(next);
              }}
            />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-gray-600 mb-1">Link</span>
            <input
              className={inputCls}
              value={link.url || ""}
              disabled={disabled}
              onChange={(e) => {
                const next = [...items];
                next[index] = { ...next[index], url: e.target.value };
                onChange(next);
              }}
              placeholder="/pad of https://..."
            />
          </label>
          <button
            type="button"
            className="text-red-600 hover:bg-red-50 rounded-lg p-2 mb-0.5"
            disabled={disabled}
            onClick={() => onChange(items.filter((_, i) => i !== index))}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="text-xs text-[#ef4d16] hover:underline inline-flex items-center gap-1"
        disabled={disabled}
        onClick={() => onChange([...items, emptyLink()])}
      >
        <Plus className="w-3 h-3" /> Menu-item toevoegen
      </button>
    </div>
  );
}

function LogoUpload({ preview, onFile, disabled }) {
  const onDrop = (accepted) => {
    const file = accepted?.[0];
    if (file) onFile(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors min-h-[120px] flex items-center justify-center ${
        isDragActive ? "border-[#ef4d16] bg-orange-50" : "border-gray-200 hover:border-[#ef4d16] hover:bg-orange-50"
      } ${disabled ? "opacity-60 pointer-events-none" : ""}`}
    >
      <input {...getInputProps()} />
      {preview ? (
        <img src={preview} alt="" className="max-h-28 w-auto mx-auto rounded-lg" />
      ) : (
        <div className="text-sm text-gray-500 flex flex-col items-center gap-2">
          <ImageIcon className="w-8 h-8 text-gray-400" />
          <span>Logo / animatie uploaden</span>
        </div>
      )}
    </div>
  );
}

function mapSocialLinks(apiLinks) {
  const map = {};
  (Array.isArray(apiLinks) ? apiLinks : []).forEach((item) => {
    if (item?.platform) map[item.platform] = item.url || "";
  });
  return SOCIAL_PLATFORMS.map((platform) => ({
    platform,
    url: map[platform] || DEFAULT_SOCIAL.find((s) => s.platform === platform)?.url || "",
  }));
}

export default function HomeFooter({ lang = "nl", embedded = false }) {
  const backendBase = useMemo(() => getBackendBaseUrl(), []);
  const [column1Title, setColumn1Title] = useState(DEFAULT_COLUMN1_TITLE);
  const [column1Links, setColumn1Links] = useState(DEFAULT_COLUMN1_LINKS);
  const [column4Title, setColumn4Title] = useState(DEFAULT_COLUMN4_TITLE);
  const [column4Links, setColumn4Links] = useState(DEFAULT_COLUMN4_LINKS);
  const [logoImageUrl, setLogoImageUrl] = useState("");
  const [logoImagePublicId, setLogoImagePublicId] = useState("");
  const [legalText, setLegalText] = useState(DEFAULT_LEGAL_TEXT);
  const [facebookPageUrl, setFacebookPageUrl] = useState(DEFAULT_FACEBOOK_PAGE);
  const [socialLinks, setSocialLinks] = useState(DEFAULT_SOCIAL);
  const [pendingLogoFile, setPendingLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${backendBase}/api/fetch-home-section/${SECTION_KEY}`);
      if (res.data?.success && res.data.section) {
        const s = res.data.section;
        setColumn1Title(s.footerColumn1Title || DEFAULT_COLUMN1_TITLE);
        setColumn1Links(s.footerColumn1Links?.length ? s.footerColumn1Links : DEFAULT_COLUMN1_LINKS);
        setColumn4Title(s.footerColumn4Title || DEFAULT_COLUMN4_TITLE);
        setColumn4Links(s.footerColumn4Links?.length ? s.footerColumn4Links : DEFAULT_COLUMN4_LINKS);
        setLogoImageUrl(s.footerLogoImageUrl || "");
        setLogoImagePublicId(s.footerLogoImagePublicId || "");
        setLegalText(s.footerLegalText || DEFAULT_LEGAL_TEXT);
        setFacebookPageUrl(s.facebookPageUrl || DEFAULT_FACEBOOK_PAGE);
        setSocialLinks(mapSocialLinks(s.socialLinks));
        setPendingLogoFile(null);
        if (logoPreview) URL.revokeObjectURL(logoPreview);
        setLogoPreview("");
      }
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Failed to load footer");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [backendBase]); // eslint-disable-line react-hooks/exhaustive-deps

  const uploadLogo = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(`${backendBase}/api/upload-image?folder=msbc/footer`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (!res.data?.success) throw new Error(res.data?.error || "Logo upload failed");
    return { url: res.data.url, publicId: res.data.publicId };
  };

  const save = async () => {
    try {
      setSaving(true);
      setStatus(null);
      setError("");

      let nextLogoUrl = logoImageUrl;
      let nextLogoPublicId = logoImagePublicId;
      if (pendingLogoFile) {
        const uploaded = await uploadLogo(pendingLogoFile);
        nextLogoUrl = uploaded.url;
        nextLogoPublicId = uploaded.publicId;
      }

      const res = await axios.put(
        `${backendBase}/api/home-sections/${SECTION_KEY}`,
        {
          title: "Footer",
          footerColumn1Title: column1Title.trim(),
          footerColumn1Links: column1Links
            .filter((l) => l.title?.trim() && l.url?.trim())
            .map((l, i) => ({ title: l.title.trim(), url: l.url.trim(), displayOrder: i })),
          footerColumn4Title: column4Title.trim(),
          footerColumn4Links: column4Links
            .filter((l) => l.title?.trim() && l.url?.trim())
            .map((l, i) => ({ title: l.title.trim(), url: l.url.trim(), displayOrder: i })),
          footerLogoImageUrl: nextLogoUrl,
          footerLogoImagePublicId: nextLogoPublicId,
          footerLegalText: legalText.trim(),
          facebookPageUrl: facebookPageUrl.trim(),
          socialLinks: socialLinks.filter((s) => s.url?.trim()),
          isActive: true,
        },
        { headers: { "Content-Type": "application/json", ...authHeaders() } }
      );

      if (res.data?.section) {
        const s = res.data.section;
        setColumn1Title(s.footerColumn1Title || DEFAULT_COLUMN1_TITLE);
        setColumn1Links(s.footerColumn1Links?.length ? s.footerColumn1Links : DEFAULT_COLUMN1_LINKS);
        setColumn4Title(s.footerColumn4Title || DEFAULT_COLUMN4_TITLE);
        setColumn4Links(s.footerColumn4Links?.length ? s.footerColumn4Links : DEFAULT_COLUMN4_LINKS);
        setLogoImageUrl(s.footerLogoImageUrl || "");
        setLogoImagePublicId(s.footerLogoImagePublicId || "");
        setLegalText(s.footerLegalText || DEFAULT_LEGAL_TEXT);
        setFacebookPageUrl(s.facebookPageUrl || DEFAULT_FACEBOOK_PAGE);
        setSocialLinks(mapSocialLinks(s.socialLinks));
        setPendingLogoFile(null);
        if (logoPreview) URL.revokeObjectURL(logoPreview);
        setLogoPreview("");
      }

      setStatus({
        type: "ok",
        text: lang === "nl" ? "Footer opgeslagen in MongoDB" : "Footer saved to MongoDB",
      });
    } catch (e) {
      setStatus({
        type: "err",
        text: e?.response?.data?.error || e?.message || (lang === "nl" ? "Opslaan mislukt" : "Save failed"),
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSocialUrl = (platform, url) => {
    setSocialLinks((prev) => prev.map((s) => (s.platform === platform ? { ...s, url } : s)));
  };

  return (
    <div className={embedded ? "space-y-4" : "space-y-6"}>
      <div className={`flex items-center justify-between gap-4 flex-wrap ${embedded ? "w-full justify-end" : "items-end"}`}>
        {!embedded && (
          <div>
            <div className="text-xl font-bold">Footer</div>
            <div className="text-sm text-gray-500">4 kolommen: menu&apos;s, logo, Facebook feed &amp; socials.</div>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="rounded-xl" onClick={load} disabled={loading || saving}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            {lang === "nl" ? "Verversen" : "Refresh"}
          </Button>
          <Button className="rounded-xl bg-[#ef4d16] hover:bg-[#d94412]" onClick={save} disabled={loading || saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "…" : lang === "nl" ? "Opslaan" : "Save"}
          </Button>
        </div>
      </div>

      {status && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm flex items-center gap-2 ${
            status.type === "ok" ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {status.type === "ok" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {status.text}
        </div>
      )}

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 p-4 space-y-3 bg-white">
          <div className="text-xs font-bold uppercase tracking-wide text-[#ef4d16]">Kolom 1</div>
          <label className="block">
            <span className="block text-xs font-medium text-gray-600 mb-1">Kolomtitel</span>
            <input className={inputCls} value={column1Title} onChange={(e) => setColumn1Title(e.target.value)} disabled={loading} />
          </label>
          <MenuLinksEditor label="Menu-items" links={column1Links} onChange={setColumn1Links} disabled={loading || saving} />
        </div>

        <div className="rounded-xl border border-gray-200 p-4 space-y-3 bg-white">
          <div className="text-xs font-bold uppercase tracking-wide text-[#ef4d16]">Kolom 4</div>
          <label className="block">
            <span className="block text-xs font-medium text-gray-600 mb-1">Kolomtitel</span>
            <input className={inputCls} value={column4Title} onChange={(e) => setColumn4Title(e.target.value)} disabled={loading} />
          </label>
          <MenuLinksEditor label="Menu-items" links={column4Links} onChange={setColumn4Links} disabled={loading || saving} />
        </div>

        <div className="rounded-xl border border-gray-200 p-4 space-y-3 bg-white">
          <div className="text-xs font-bold uppercase tracking-wide text-[#ef4d16]">Kolom 2 — Logo</div>
          <LogoUpload
            preview={logoPreview || logoImageUrl}
            disabled={loading || saving}
            onFile={(file) => {
              if (logoPreview) URL.revokeObjectURL(logoPreview);
              setPendingLogoFile(file);
              setLogoPreview(URL.createObjectURL(file));
            }}
          />
          <label className="block">
            <span className="block text-xs font-medium text-gray-600 mb-1">Juridische tekst onder logo</span>
            <textarea
              className={`${inputCls} min-h-[80px]`}
              value={legalText}
              onChange={(e) => setLegalText(e.target.value)}
              disabled={loading}
            />
          </label>
        </div>

        <div className="rounded-xl border border-gray-200 p-4 space-y-3 bg-white">
          <div className="text-xs font-bold uppercase tracking-wide text-[#ef4d16]">Kolom 3 — Facebook &amp; Social</div>
          <label className="block">
            <span className="block text-xs font-medium text-gray-600 mb-1">Facebook pagina URL (feed)</span>
            <input
              className={inputCls}
              value={facebookPageUrl}
              onChange={(e) => setFacebookPageUrl(e.target.value)}
              placeholder={DEFAULT_FACEBOOK_PAGE}
              disabled={loading}
            />
          </label>
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-600">Social media links</div>
            {socialLinks.map((item) => (
              <label key={item.platform} className="block">
                <span className="block text-xs text-gray-500 mb-1">{PLATFORM_LABELS[item.platform] || item.platform}</span>
                <input
                  className={inputCls}
                  value={item.url}
                  onChange={(e) => updateSocialUrl(item.platform, e.target.value)}
                  disabled={loading}
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
