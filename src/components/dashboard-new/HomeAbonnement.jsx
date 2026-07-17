import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import { Save, RefreshCw, CheckCircle2, AlertCircle, ImageIcon } from "lucide-react";
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

function Field({ label, children }) {
  return (
    <label className="block space-y-1">
      <span className="block text-xs font-medium text-gray-600">{label}</span>
      {children}
    </label>
  );
}

function ImageUpload({ preview, onFile, lang, disabled }) {
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
    <div>
      <span className="block text-xs font-medium text-gray-600 mb-1">
        {lang === "nl" ? "Bannerafbeelding" : "Banner image"}
      </span>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors min-h-[120px] flex items-center justify-center ${
          isDragActive ? "border-[#ef4d16] bg-orange-50" : "border-gray-200 hover:border-[#ef4d16] hover:bg-orange-50"
        } ${disabled ? "opacity-60 pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <img src={preview} alt="" className="max-h-48 w-auto h-auto mx-auto rounded-lg" />
        ) : (
          <div className="text-sm text-gray-500 flex flex-col items-center gap-2">
            <ImageIcon className="w-8 h-8 text-gray-400" />
            <span>{lang === "nl" ? "Sleep of klik om afbeelding te uploaden" : "Drag or click to upload image"}</span>
          </div>
        )}
      </div>
      <span className="block text-xs text-gray-400 mt-1">
        {lang === "nl"
          ? "Wordt getoond rechts op de Abonnement-pagina (/abonnement)."
          : "Shown on the right side of the Abonnement page (/abonnement)."}
      </span>
    </div>
  );
}

export default function HomeAbonnement({ lang = "nl", embedded = false }) {
  const backendBase = useMemo(() => getBackendBaseUrl(), []);
  const [title, setTitle] = useState(DEFAULTS.title);
  const [bodyText, setBodyText] = useState(DEFAULTS.bodyText);
  const [buttonLabel, setButtonLabel] = useState(DEFAULTS.buttonLabel);
  const [buttonUrl, setButtonUrl] = useState(DEFAULTS.buttonUrl);
  const [imageUrl, setImageUrl] = useState(DEFAULTS.bannerImageUrl);
  const [imagePublicId, setImagePublicId] = useState("");
  const [pendingFile, setPendingFile] = useState(null);
  const [preview, setPreview] = useState("");
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
        const section = res.data.section;
        setTitle(section.title || DEFAULTS.title);
        setBodyText(section.bodyText || DEFAULTS.bodyText);
        setButtonLabel(section.buttonLabel || DEFAULTS.buttonLabel);
        setButtonUrl(section.buttonUrl || DEFAULTS.buttonUrl);
        setImageUrl(section.bannerImageUrl || DEFAULTS.bannerImageUrl);
        setImagePublicId(section.bannerImagePublicId || "");
        setPendingFile(null);
        if (preview) URL.revokeObjectURL(preview);
        setPreview("");
      }
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Failed to load section");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [backendBase]); // eslint-disable-line react-hooks/exhaustive-deps

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(`${backendBase}/api/upload-image?folder=msbc/abonnement`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (!res.data?.success) throw new Error(res.data?.error || "Image upload failed");
    return { url: res.data.url, publicId: res.data.publicId };
  };

  const save = async () => {
    try {
      setSaving(true);
      setStatus(null);
      setError("");

      let nextUrl = imageUrl;
      let nextPublicId = imagePublicId;

      if (pendingFile) {
        const uploaded = await uploadImage(pendingFile);
        nextUrl = uploaded.url;
        nextPublicId = uploaded.publicId;
      }

      const res = await axios.put(
        `${backendBase}/api/home-sections/${SECTION_KEY}`,
        {
          title: title.trim() || DEFAULTS.title,
          bodyText: bodyText.trim() || DEFAULTS.bodyText,
          buttonLabel: buttonLabel.trim() || DEFAULTS.buttonLabel,
          buttonUrl: buttonUrl.trim() || DEFAULTS.buttonUrl,
          bannerImageUrl: nextUrl,
          bannerImagePublicId: nextPublicId,
          isActive: true,
        },
        { headers: { "Content-Type": "application/json", ...authHeaders() } }
      );

      if (res.data?.section) {
        const section = res.data.section;
        setTitle(section.title || DEFAULTS.title);
        setBodyText(section.bodyText || DEFAULTS.bodyText);
        setButtonLabel(section.buttonLabel || DEFAULTS.buttonLabel);
        setButtonUrl(section.buttonUrl || DEFAULTS.buttonUrl);
        setImageUrl(section.bannerImageUrl || "");
        setImagePublicId(section.bannerImagePublicId || "");
        setPendingFile(null);
        if (preview) URL.revokeObjectURL(preview);
        setPreview("");
      }

      setStatus({
        type: "ok",
        text: lang === "nl" ? "Abonnement-banner opgeslagen" : "Abonnement banner saved",
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

  return (
    <div className={embedded ? "space-y-4" : "space-y-6"}>
      <div className={`flex items-center justify-between gap-4 flex-wrap ${embedded ? "w-full justify-end" : "items-end"}`}>
        {!embedded && (
          <div>
            <div className="text-xl font-bold">Abonnement</div>
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
            status.type === "ok"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {status.type === "ok" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {status.text}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-4">
          <Field label={lang === "nl" ? "Titel" : "Title"}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputCls}
              disabled={loading || saving}
              placeholder={DEFAULTS.title}
            />
            <span className="block text-xs text-gray-400 mt-1">
              {lang === "nl"
                ? "Zet woorden tussen *sterren* voor oranje highlight, bijv. *Fit*"
                : "Wrap words in *asterisks* for orange highlight, e.g. *Fit*"}
            </span>
          </Field>

          <Field label={lang === "nl" ? "Tekst" : "Body text"}>
            <textarea
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              className={`${inputCls} min-h-[160px] resize-y`}
              disabled={loading || saving}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={lang === "nl" ? "Knoptekst" : "Button label"}>
              <input
                type="text"
                value={buttonLabel}
                onChange={(e) => setButtonLabel(e.target.value)}
                className={inputCls}
                disabled={loading || saving}
              />
            </Field>
            <Field label={lang === "nl" ? "Knop-link" : "Button URL"}>
              <input
                type="text"
                value={buttonUrl}
                onChange={(e) => setButtonUrl(e.target.value)}
                className={inputCls}
                disabled={loading || saving}
                placeholder="/proefles"
              />
            </Field>
          </div>
        </div>

        <ImageUpload
          preview={preview || imageUrl}
          lang={lang}
          disabled={loading || saving}
          onFile={(file) => {
            if (preview) URL.revokeObjectURL(preview);
            setPendingFile(file);
            setPreview(URL.createObjectURL(file));
          }}
        />
      </div>
    </div>
  );
}
