import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, Trash2, Save, RefreshCw, CheckCircle2, AlertCircle, ImageIcon, Film, GripVertical } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { getBackendBaseUrl } from "../../utils/backend";

const AVAILABLE_PROGRAMS = [
  { key: "personal-training", label: "Personal Training" },
  { key: "groep-pt", label: "Groep PT Training" },
  { key: "wedstrijd-training", label: "Wedstrijd Training" },
  { key: "afvallen-training", label: "Afvallen Training" },
  { key: "summerbody-1jarig", label: "Summerbody 1 jarig" },
  { key: "summerbody-6-maanden", label: "Summerbody 6 maanden" },
  { key: "summerbody-flex", label: "Summerbody Flex" },
];

const INTRO_PROGRAM_KEYS = new Set([
  "personal-training",
  "groep-pt",
  "wedstrijd-training",
  "afvallen-training",
]);

const emptyPaymentOption = () => ({
  trainingTitle: "",
  programType: "ptTraining",
  amount: "",
  quantity: "",
  title: "",
  subTitle: "",
  abonnementType: "",
  abonnementTitle: "",
  kosten: [""],
  totalKosten: [""],
  extra: false,
  recurring: false,
});

const emptyExtraOption = () => ({ amount: "", title: "" });

const emptyClubAmount = () => ({ amount: "", title: "", status: false });

const emptyTrainingDescription = () => ({
  title: "",
  quote: "",
  trainingFeatures: [""],
  startingPrice: "",
  tenure: "",
  cardHeadline: "",
  headLineBg: "#f04d17",
  trainingLink: "",
});

function authHeaders() {
  try {
    const raw = localStorage.getItem("msbc_dashboard_auth");
    const token = raw ? JSON.parse(raw)?.token : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

function Field({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-medium text-gray-600 mb-1">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#ef4d16]";

function StringListEditor({ label, items, onChange }) {
  const safeItems = Array.isArray(items) ? items : [];
  return (
    <div>
      <div className="text-xs font-medium text-gray-600 mb-1">{label}</div>
      <div className="space-y-2">
        {safeItems.map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              className={inputCls}
              value={item}
              onChange={(e) => {
                const next = [...safeItems];
                next[idx] = e.target.value;
                onChange(next);
              }}
            />
            <button
              type="button"
              className="px-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => onChange(safeItems.filter((_, i) => i !== idx))}
              aria-label="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="text-xs text-[#ef4d16] hover:underline inline-flex items-center gap-1"
          onClick={() => onChange([...safeItems, ""])}
        >
          <Plus className="w-3 h-3" /> Item toevoegen
        </button>
      </div>
    </div>
  );
}

function FeaturedImageUpload({ preview, onFile, disabled, label, hint }) {
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
      {label && <span className="block text-xs font-medium text-gray-600 mb-1">{label}</span>}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors min-h-[160px] flex items-center justify-center ${
          isDragActive ? "border-[#ef4d16] bg-orange-50" : "border-gray-200 hover:border-[#ef4d16] hover:bg-orange-50"
        } ${disabled ? "opacity-60 pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <img src={preview} alt="" className="max-h-48 w-auto h-auto mx-auto rounded-lg object-contain" />
        ) : (
          <div className="text-sm text-gray-500 flex flex-col items-center gap-2">
            <ImageIcon className="w-8 h-8 text-gray-400" />
            <span>{hint || "Sleep of klik om afbeelding te uploaden"}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function IntroVideoUpload({ previewUrl, onFile, disabled }) {
  const onDrop = (accepted) => {
    const file = accepted?.[0];
    if (file) onFile(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [".mp4", ".webm", ".mov"] },
    maxSize: 50 * 1024 * 1024,
    multiple: false,
    disabled,
  });

  return (
    <div>
      <span className="block text-xs font-medium text-gray-600 mb-1">Intro video (midden)</span>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors min-h-[160px] flex items-center justify-center ${
          isDragActive ? "border-[#ef4d16] bg-orange-50" : "border-gray-200 hover:border-[#ef4d16] hover:bg-orange-50"
        } ${disabled ? "opacity-60 pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} />
        {previewUrl ? (
          <video src={previewUrl} controls className="max-h-48 w-full rounded-lg" />
        ) : (
          <div className="text-sm text-gray-500 flex flex-col items-center gap-2">
            <Film className="w-8 h-8 text-gray-400" />
            <span>Sleep of klik om video te uploaden (MP4, max 50 MB)</span>
          </div>
        )}
      </div>
    </div>
  );
}

const CLUB_SUBSCRIPTIONS_KEY = "club-subscriptions";

export default function Programs() {
  const [programKey, setProgramKey] = useState(AVAILABLE_PROGRAMS[0].key);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);

  const [paymentOptions, setPaymentOptions] = useState([]);
  const [extraOptions, setExtraOptions] = useState([]);
  const [clubAmount, setClubAmount] = useState([]);
  const [trainingDescription, setTrainingDescription] = useState([]);
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [featuredImagePublicId, setFeaturedImagePublicId] = useState("");
  const [pendingFeaturedFile, setPendingFeaturedFile] = useState(null);
  const [featuredPreview, setFeaturedPreview] = useState("");
  const [introImage1Url, setIntroImage1Url] = useState("");
  const [introImage1PublicId, setIntroImage1PublicId] = useState("");
  const [introImage2Url, setIntroImage2Url] = useState("");
  const [introImage2PublicId, setIntroImage2PublicId] = useState("");
  const [introVideoUrl, setIntroVideoUrl] = useState("");
  const [introVideoPublicId, setIntroVideoPublicId] = useState("");
  const [introQuote, setIntroQuote] = useState("");
  const [introDescription, setIntroDescription] = useState("");
  const [pendingIntroImage1, setPendingIntroImage1] = useState(null);
  const [pendingIntroImage2, setPendingIntroImage2] = useState(null);
  const [pendingIntroVideo, setPendingIntroVideo] = useState(null);
  const [introPreview1, setIntroPreview1] = useState("");
  const [introPreview2, setIntroPreview2] = useState("");
  const [introVideoPreview, setIntroVideoPreview] = useState("");
  const [clubSubscriptionsVisible, setClubSubscriptionsVisible] = useState(true);
  const [clubToggleSaving, setClubToggleSaving] = useState(false);
  const [dragOptionIndex, setDragOptionIndex] = useState(null);
  const [dragOverOptionIndex, setDragOverOptionIndex] = useState(null);

  const backendBaseUrl = useMemo(() => getBackendBaseUrl(), []);

  const loadClubSubscriptionsVisibility = async () => {
    try {
      const res = await axios.get(`${backendBaseUrl}/api/fetch-home-section/${CLUB_SUBSCRIPTIONS_KEY}`);
      if (res.data?.success && res.data.section) {
        setClubSubscriptionsVisible(res.data.section.isActive !== false);
      }
    } catch {
      setClubSubscriptionsVisible(true);
    }
  };

  const toggleClubSubscriptions = async () => {
    const nextVisible = !clubSubscriptionsVisible;
    try {
      setClubToggleSaving(true);
      await axios.put(
        `${backendBaseUrl}/api/home-sections/${CLUB_SUBSCRIPTIONS_KEY}`,
        {
          title: "Club Abonnementen",
          isActive: nextVisible,
        },
        { headers: { "Content-Type": "application/json", ...authHeaders() } }
      );
      setClubSubscriptionsVisible(nextVisible);
    } catch (e) {
      setStatus({
        type: "err",
        text: e?.response?.data?.error || e?.message || "Club abonnementen toggle mislukt",
      });
    } finally {
      setClubToggleSaving(false);
    }
  };

  const load = async (key = programKey) => {
    try {
      setLoading(true);
      setError("");
      setStatus(null);
      const res = await axios.get(`${backendBaseUrl}/api/program-config/${key}`);
      setPaymentOptions(Array.isArray(res.data?.paymentOptions) ? res.data.paymentOptions : []);
      setExtraOptions(Array.isArray(res.data?.extraOptions) ? res.data.extraOptions : []);
      setClubAmount(Array.isArray(res.data?.clubAmount) ? res.data.clubAmount : []);
      setTrainingDescription(Array.isArray(res.data?.trainingDescription) ? res.data.trainingDescription : []);
      setFeaturedImageUrl(res.data?.featuredImageUrl || "");
      setFeaturedImagePublicId(res.data?.featuredImagePublicId || "");
      setIntroImage1Url(res.data?.introImage1Url || "");
      setIntroImage1PublicId(res.data?.introImage1PublicId || "");
      setIntroImage2Url(res.data?.introImage2Url || "");
      setIntroImage2PublicId(res.data?.introImage2PublicId || "");
      setIntroVideoUrl(res.data?.introVideoUrl || "");
      setIntroVideoPublicId(res.data?.introVideoPublicId || "");
      setIntroQuote(res.data?.introQuote || "");
      setIntroDescription(res.data?.introDescription || "");
      setPendingFeaturedFile(null);
      setPendingIntroImage1(null);
      setPendingIntroImage2(null);
      setPendingIntroVideo(null);
      if (featuredPreview) URL.revokeObjectURL(featuredPreview);
      if (introPreview1) URL.revokeObjectURL(introPreview1);
      if (introPreview2) URL.revokeObjectURL(introPreview2);
      if (introVideoPreview) URL.revokeObjectURL(introVideoPreview);
      setFeaturedPreview("");
      setIntroPreview1("");
      setIntroPreview2("");
      setIntroVideoPreview("");
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Failed to load program config");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(programKey);
  }, [programKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadClubSubscriptionsVisibility();
  }, [backendBaseUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  const uploadFeaturedImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(`${backendBaseUrl}/api/upload-image?folder=msbc/programs`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (!res.data?.success) throw new Error(res.data?.error || "Image upload failed");
    return { url: res.data.url, publicId: res.data.publicId };
  };

  const uploadIntroImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(`${backendBaseUrl}/api/upload-image?folder=msbc/intro`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (!res.data?.success) throw new Error(res.data?.error || "Image upload failed");
    return { url: res.data.url, publicId: res.data.publicId };
  };

  const uploadIntroVideo = async (file) => {
    const formData = new FormData();
    formData.append("video", file);
    const res = await axios.post(`${backendBaseUrl}/api/upload-video?folder=msbc/intro-videos`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (!res.data?.success) throw new Error(res.data?.error || "Video upload failed");
    return { url: res.data.url, publicId: res.data.publicId };
  };

  const save = async () => {
    try {
      setSaving(true);
      setStatus(null);

      let nextFeaturedUrl = featuredImageUrl;
      let nextFeaturedPublicId = featuredImagePublicId;
      let nextIntroImage1Url = introImage1Url;
      let nextIntroImage1PublicId = introImage1PublicId;
      let nextIntroImage2Url = introImage2Url;
      let nextIntroImage2PublicId = introImage2PublicId;
      let nextIntroVideoUrl = introVideoUrl;
      let nextIntroVideoPublicId = introVideoPublicId;

      if (pendingFeaturedFile) {
        const uploaded = await uploadFeaturedImage(pendingFeaturedFile);
        nextFeaturedUrl = uploaded.url;
        nextFeaturedPublicId = uploaded.publicId;
      }

      if (pendingIntroImage1) {
        const uploaded = await uploadIntroImage(pendingIntroImage1);
        nextIntroImage1Url = uploaded.url;
        nextIntroImage1PublicId = uploaded.publicId;
      }

      if (pendingIntroImage2) {
        const uploaded = await uploadIntroImage(pendingIntroImage2);
        nextIntroImage2Url = uploaded.url;
        nextIntroImage2PublicId = uploaded.publicId;
      }

      if (pendingIntroVideo) {
        const uploaded = await uploadIntroVideo(pendingIntroVideo);
        nextIntroVideoUrl = uploaded.url;
        nextIntroVideoPublicId = uploaded.publicId;
      }

      const res = await axios.put(
        `${backendBaseUrl}/api/program-config/${programKey}`,
        {
          paymentOptions,
          extraOptions,
          clubAmount,
          trainingDescription,
          featuredImageUrl: nextFeaturedUrl,
          featuredImagePublicId: nextFeaturedPublicId,
          introImage1Url: nextIntroImage1Url,
          introImage1PublicId: nextIntroImage1PublicId,
          introImage2Url: nextIntroImage2Url,
          introImage2PublicId: nextIntroImage2PublicId,
          introVideoUrl: nextIntroVideoUrl,
          introVideoPublicId: nextIntroVideoPublicId,
          introQuote,
          introDescription,
        },
        { headers: { "Content-Type": "application/json", ...authHeaders() } }
      );
      if (res.data?.success !== false) {
        setFeaturedImageUrl(res.data?.featuredImageUrl || nextFeaturedUrl);
        setFeaturedImagePublicId(res.data?.featuredImagePublicId || nextFeaturedPublicId);
        setIntroImage1Url(res.data?.introImage1Url || nextIntroImage1Url);
        setIntroImage1PublicId(res.data?.introImage1PublicId || nextIntroImage1PublicId);
        setIntroImage2Url(res.data?.introImage2Url || nextIntroImage2Url);
        setIntroImage2PublicId(res.data?.introImage2PublicId || nextIntroImage2PublicId);
        setIntroVideoUrl(res.data?.introVideoUrl || nextIntroVideoUrl);
        setIntroVideoPublicId(res.data?.introVideoPublicId || nextIntroVideoPublicId);
        setIntroQuote(res.data?.introQuote ?? introQuote);
        setIntroDescription(res.data?.introDescription ?? introDescription);
        setPendingFeaturedFile(null);
        setPendingIntroImage1(null);
        setPendingIntroImage2(null);
        setPendingIntroVideo(null);
        if (featuredPreview) URL.revokeObjectURL(featuredPreview);
        if (introPreview1) URL.revokeObjectURL(introPreview1);
        if (introPreview2) URL.revokeObjectURL(introPreview2);
        if (introVideoPreview) URL.revokeObjectURL(introVideoPreview);
        setFeaturedPreview("");
        setIntroPreview1("");
        setIntroPreview2("");
        setIntroVideoPreview("");
        setStatus({ type: "ok", text: "Opgeslagen in MongoDB" });
      } else {
        setStatus({ type: "err", text: res.data?.error || "Opslaan mislukt" });
      }
    } catch (e) {
      setStatus({ type: "err", text: e?.response?.data?.error || e?.message || "Opslaan mislukt" });
    } finally {
      setSaving(false);
    }
  };

  const updatePaymentOption = (idx, patch) => {
    setPaymentOptions((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  };
  const removePaymentOption = (idx) => {
    setPaymentOptions((prev) => prev.filter((_, i) => i !== idx));
  };
  const reorderPaymentOptions = (fromIndex, toIndex) => {
    if (fromIndex === toIndex || fromIndex == null || toIndex == null) return;
    setPaymentOptions((prev) => {
      if (fromIndex < 0 || toIndex < 0 || fromIndex >= prev.length || toIndex >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const updateExtra = (idx, patch) => {
    setExtraOptions((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  };

  const updateClub = (idx, patch) => {
    setClubAmount((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  };

  const updateDescription = (idx, patch) => {
    setTrainingDescription((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  };

  const showIntroSection = INTRO_PROGRAM_KEYS.has(programKey);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-2xl font-bold">Programs</div>
          <div className="text-sm text-gray-500">Beheer trainings­pakketten, prijzen en pagina inhoud (opgeslagen in MongoDB).</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">Club abonnementen</span>
            <button
              type="button"
              role="switch"
              aria-checked={clubSubscriptionsVisible}
              disabled={clubToggleSaving}
              onClick={toggleClubSubscriptions}
              className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#ef4d16] focus:ring-offset-2 disabled:opacity-60 ${
                clubSubscriptionsVisible ? "bg-[#ef4d16]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  clubSubscriptionsVisible ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-xs font-medium ${clubSubscriptionsVisible ? "text-green-600" : "text-gray-400"}`}>
              {clubSubscriptionsVisible ? "Aan" : "Uit"}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
            <span className="text-sm text-gray-600">Programma</span>
            <select
              value={programKey}
              onChange={(e) => setProgramKey(e.target.value)}
              className="outline-none text-sm bg-transparent"
            >
              {AVAILABLE_PROGRAMS.map((p) => (
                <option key={p.key} value={p.key}>{p.label}</option>
              ))}
            </select>
          </div>
          <Button variant="outline" className="rounded-xl" onClick={() => load(programKey)} disabled={loading || saving}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Verversen
          </Button>
          <Button className="rounded-xl bg-[#ef4d16] hover:bg-[#d23f0f] text-white" onClick={save} disabled={loading || saving}>
            <Save className="w-4 h-4 mr-2" /> {saving ? "Opslaan..." : "Opslaan"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 inline-flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
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

      {loading ? (
        <div className="text-sm text-gray-500">Laden...</div>
      ) : (
        <>
          <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-1">Featured Card Image</h2>
              <p className="text-sm text-gray-500 mb-4">
                Afbeelding op de training card voor{" "}
                <span className="font-medium text-gray-700">
                  {AVAILABLE_PROGRAMS.find((p) => p.key === programKey)?.label || programKey}
                </span>{" "}
                (Cloudinary + MongoDB).
              </p>
              <FeaturedImageUpload
                preview={featuredPreview || featuredImageUrl}
                disabled={loading || saving}
                onFile={(file) => {
                  if (featuredPreview) URL.revokeObjectURL(featuredPreview);
                  setPendingFeaturedFile(file);
                  setFeaturedPreview(URL.createObjectURL(file));
                }}
              />
            </CardContent>
          </Card>

          {showIntroSection && (
            <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-1">Introduction Section Images &amp; Video</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Twee afbeeldingen en één video op de intro-pagina (
                  <span className="font-medium text-gray-700">/trainingprograms/{programKey}</span>
                  ).
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <FeaturedImageUpload
                    label="Intro afbeelding 1 (links)"
                    hint="Eerste bannerafbeelding"
                    preview={introPreview1 || introImage1Url}
                    disabled={loading || saving}
                    onFile={(file) => {
                      if (introPreview1) URL.revokeObjectURL(introPreview1);
                      setPendingIntroImage1(file);
                      setIntroPreview1(URL.createObjectURL(file));
                    }}
                  />
                  <IntroVideoUpload
                    previewUrl={introVideoPreview || introVideoUrl}
                    disabled={loading || saving}
                    onFile={(file) => {
                      if (introVideoPreview) URL.revokeObjectURL(introVideoPreview);
                      setPendingIntroVideo(file);
                      setIntroVideoPreview(URL.createObjectURL(file));
                    }}
                  />
                  <FeaturedImageUpload
                    label="Intro afbeelding 2 (rechts)"
                    hint="Tweede bannerafbeelding"
                    preview={introPreview2 || introImage2Url}
                    disabled={loading || saving}
                    onFile={(file) => {
                      if (introPreview2) URL.revokeObjectURL(introPreview2);
                      setPendingIntroImage2(file);
                      setIntroPreview2(URL.createObjectURL(file));
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <Field label="Quote">
                    <textarea
                      className={`${inputCls} min-h-[80px] resize-y`}
                      value={introQuote}
                      onChange={(e) => setIntroQuote(e.target.value)}
                      disabled={loading || saving}
                      placeholder='"Alleen ik kan mijn levensstijl veranderen, niemand kan het voor mij doen."'
                    />
                  </Field>
                  <Field label="Beschrijving">
                    <textarea
                      className={`${inputCls} min-h-[120px] resize-y`}
                      value={introDescription}
                      onChange={(e) => setIntroDescription(e.target.value)}
                      disabled={loading || saving}
                      placeholder="Tekst onder de quote op de intro-pagina"
                    />
                  </Field>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Options */}
          <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Payment Options</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Sleep opties om de volgorde te wijzigen</p>
                </div>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setPaymentOptions((prev) => [...prev, emptyPaymentOption()])}
                >
                  <Plus className="w-4 h-4 mr-2" /> Optie toevoegen
                </Button>
              </div>
              <div className="space-y-4">
                {paymentOptions.map((p, idx) => (
                  <div
                    key={idx}
                    draggable={false}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (dragOptionIndex !== null && dragOptionIndex !== idx) {
                        setDragOverOptionIndex(idx);
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      reorderPaymentOptions(dragOptionIndex, idx);
                      setDragOptionIndex(null);
                      setDragOverOptionIndex(null);
                    }}
                    onDragLeave={() => {
                      if (dragOverOptionIndex === idx) setDragOverOptionIndex(null);
                    }}
                    className={`rounded-xl border p-4 bg-gray-50 transition-all ${
                      dragOptionIndex === idx
                        ? "opacity-50 border-[#ef4d16] border-dashed"
                        : dragOverOptionIndex === idx
                        ? "border-[#ef4d16] ring-2 ring-[#ef4d16]/20"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          draggable
                          onDragStart={(e) => {
                            setDragOptionIndex(idx);
                            e.dataTransfer.effectAllowed = "move";
                            e.dataTransfer.setData("text/plain", String(idx));
                          }}
                          onDragEnd={() => {
                            setDragOptionIndex(null);
                            setDragOverOptionIndex(null);
                          }}
                          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-200 select-none"
                          title="Sleep om te herordenen"
                          aria-label="Sleep om te herordenen"
                        >
                          <GripVertical className="w-5 h-5 pointer-events-none" />
                        </div>
                        <div className="text-sm font-semibold text-gray-700">Optie #{idx + 1}</div>
                      </div>
                      <button
                        type="button"
                        className="text-red-600 hover:bg-red-50 rounded-lg p-1"
                        onClick={() => removePaymentOption(idx)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Field label="Training Title">
                        <input className={inputCls} value={p.trainingTitle || ""} onChange={(e) => updatePaymentOption(idx, { trainingTitle: e.target.value })} />
                      </Field>
                      <Field label="Program Type">
                        <select
                          className={inputCls}
                          value={p.programType || ""}
                          onChange={(e) => updatePaymentOption(idx, { programType: e.target.value })}
                        >
                          <option value="ptTraining">ptTraining</option>
                          <option value="club">club</option>
                          <option value="pt-ruimte">pt-ruimte</option>
                          <option value="">(geen)</option>
                        </select>
                      </Field>
                      <Field label="Amount (€)">
                        <input className={inputCls} value={p.amount || ""} onChange={(e) => updatePaymentOption(idx, { amount: e.target.value })} />
                      </Field>
                      <Field label="Quantity">
                        <input className={inputCls} value={p.quantity || ""} onChange={(e) => updatePaymentOption(idx, { quantity: e.target.value })} />
                      </Field>
                      <Field label="Title" className="md:col-span-2">
                        <input className={inputCls} value={p.title || ""} onChange={(e) => updatePaymentOption(idx, { title: e.target.value })} />
                      </Field>
                      <Field label="Subtitle" className="md:col-span-2">
                        <input className={inputCls} value={p.subTitle || ""} onChange={(e) => updatePaymentOption(idx, { subTitle: e.target.value })} />
                      </Field>
                      <Field label="Abonnement Type">
                        <input className={inputCls} value={p.abonnementType || ""} onChange={(e) => updatePaymentOption(idx, { abonnementType: e.target.value })} />
                      </Field>
                      <Field label="Abonnement Title">
                        <input className={inputCls} value={p.abonnementTitle || ""} onChange={(e) => updatePaymentOption(idx, { abonnementTitle: e.target.value })} />
                      </Field>
                      <div className="md:col-span-2">
                        <StringListEditor label="Kosten (regels)" items={p.kosten} onChange={(next) => updatePaymentOption(idx, { kosten: next })} />
                      </div>
                      <div className="md:col-span-2">
                        <StringListEditor label="Totaal Kosten (regels)" items={p.totalKosten} onChange={(next) => updatePaymentOption(idx, { totalKosten: next })} />
                      </div>
                      <label className="inline-flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={!!p.extra} onChange={(e) => updatePaymentOption(idx, { extra: e.target.checked })} />
                        Extra optie tonen
                      </label>
                      <label className="inline-flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={!!p.recurring} onChange={(e) => updatePaymentOption(idx, { recurring: e.target.checked })} />
                        Terugkerend (subscription)
                      </label>
                    </div>
                  </div>
                ))}
                {paymentOptions.length === 0 && (
                  <div className="text-sm text-gray-500">Nog geen payment options.</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Extra Options */}
          <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Extra Options</h2>
                <Button variant="outline" className="rounded-xl" onClick={() => setExtraOptions((prev) => [...prev, emptyExtraOption()])}>
                  <Plus className="w-4 h-4 mr-2" /> Optie toevoegen
                </Button>
              </div>
              <div className="space-y-3">
                {extraOptions.map((p, idx) => (
                  <div key={idx} className="flex gap-3 items-end rounded-xl border border-gray-200 p-3 bg-gray-50">
                    <Field label="Amount (€)" className="w-32"><input className={inputCls} value={p.amount || ""} onChange={(e) => updateExtra(idx, { amount: e.target.value })} /></Field>
                    <Field label="Title" className="flex-1"><input className={inputCls} value={p.title || ""} onChange={(e) => updateExtra(idx, { title: e.target.value })} /></Field>
                    <button type="button" className="text-red-600 hover:bg-red-50 rounded-lg p-2 mb-1" onClick={() => setExtraOptions((prev) => prev.filter((_, i) => i !== idx))}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {extraOptions.length === 0 && <div className="text-sm text-gray-500">Geen extra options.</div>}
              </div>
            </CardContent>
          </Card>

          {/* Club Amount */}
          <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Club Amount</h2>
                <Button variant="outline" className="rounded-xl" onClick={() => setClubAmount((prev) => [...prev, emptyClubAmount()])}>
                  <Plus className="w-4 h-4 mr-2" /> Item toevoegen
                </Button>
              </div>
              <div className="space-y-3">
                {clubAmount.map((p, idx) => (
                  <div key={idx} className="flex gap-3 items-end rounded-xl border border-gray-200 p-3 bg-gray-50">
                    <Field label="Amount (€)" className="w-32"><input className={inputCls} value={p.amount || ""} onChange={(e) => updateClub(idx, { amount: e.target.value })} /></Field>
                    <Field label="Title" className="flex-1"><input className={inputCls} value={p.title || ""} onChange={(e) => updateClub(idx, { title: e.target.value })} /></Field>
                    <label className="inline-flex items-center gap-2 text-sm mb-2">
                      <input type="checkbox" checked={!!p.status} onChange={(e) => updateClub(idx, { status: e.target.checked })} />
                      Actief
                    </label>
                    <button type="button" className="text-red-600 hover:bg-red-50 rounded-lg p-2 mb-1" onClick={() => setClubAmount((prev) => prev.filter((_, i) => i !== idx))}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {clubAmount.length === 0 && <div className="text-sm text-gray-500">Geen club amount items.</div>}
              </div>
            </CardContent>
          </Card>

          {/* Training Description */}
          <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Training Description</h2>
                <Button variant="outline" className="rounded-xl" onClick={() => setTrainingDescription((prev) => [...prev, emptyTrainingDescription()])}>
                  <Plus className="w-4 h-4 mr-2" /> Beschrijving toevoegen
                </Button>
              </div>
              <div className="space-y-4">
                {trainingDescription.map((d, idx) => (
                  <div key={idx} className="rounded-xl border border-gray-200 p-4 bg-gray-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-gray-700">Beschrijving #{idx + 1}</div>
                      <button type="button" className="text-red-600 hover:bg-red-50 rounded-lg p-1" onClick={() => setTrainingDescription((prev) => prev.filter((_, i) => i !== idx))}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Field label="Title"><input className={inputCls} value={d.title || ""} onChange={(e) => updateDescription(idx, { title: e.target.value })} /></Field>
                      <Field label="Card Headline"><input className={inputCls} value={d.cardHeadline || ""} onChange={(e) => updateDescription(idx, { cardHeadline: e.target.value })} /></Field>
                      <Field label="Starting Price"><input className={inputCls} value={d.startingPrice || ""} onChange={(e) => updateDescription(idx, { startingPrice: e.target.value })} /></Field>
                      <Field label="Tenure"><input className={inputCls} value={d.tenure || ""} onChange={(e) => updateDescription(idx, { tenure: e.target.value })} /></Field>
                      <Field label="Headline Background (hex)"><input className={inputCls} value={d.headLineBg || ""} onChange={(e) => updateDescription(idx, { headLineBg: e.target.value })} /></Field>
                      <Field label="Training Link"><input className={inputCls} value={d.trainingLink || ""} onChange={(e) => updateDescription(idx, { trainingLink: e.target.value })} /></Field>
                      <Field label="Quote" className="md:col-span-2">
                        <textarea
                          className={`${inputCls} min-h-[80px]`}
                          value={d.quote || ""}
                          onChange={(e) => updateDescription(idx, { quote: e.target.value })}
                        />
                      </Field>
                      <div className="md:col-span-2">
                        <StringListEditor
                          label="Training Features"
                          items={d.trainingFeatures}
                          onChange={(next) => updateDescription(idx, { trainingFeatures: next })}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {trainingDescription.length === 0 && <div className="text-sm text-gray-500">Geen beschrijvingen.</div>}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="rounded-xl bg-[#ef4d16] hover:bg-[#d23f0f] text-white" onClick={save} disabled={saving}>
              <Save className="w-4 h-4 mr-2" /> {saving ? "Opslaan..." : "Alles opslaan"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
