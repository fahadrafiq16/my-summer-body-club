import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import { Save, RefreshCw, CheckCircle2, AlertCircle, ImageIcon } from "lucide-react";
import { getBackendBaseUrl } from "../../utils/backend";

function authHeaders() {
  try {
    const raw = localStorage.getItem("msbc_dashboard_auth");
    const token = raw ? JSON.parse(raw)?.token : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

function HeroImageUpload({ preview, onFile, lang, disabled, hint }) {
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
        {lang === "nl" ? "Pagina-afbeelding" : "Page image"}
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
      {hint && <span className="block text-xs text-gray-400 mt-1">{hint}</span>}
    </div>
  );
}

export default function HomePageHeroImage({
  sectionKey,
  title,
  uploadFolder,
  lang = "nl",
  embedded = false,
  hintNl,
  hintEn,
}) {
  const backendBase = useMemo(() => getBackendBaseUrl(), []);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");
  const [pendingFile, setPendingFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);

  const hint = lang === "nl" ? hintNl : hintEn;

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${backendBase}/api/fetch-home-section/${sectionKey}`);
      if (res.data?.success && res.data.section) {
        const section = res.data.section;
        setImageUrl(section.bannerImageUrl || "");
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
  }, [backendBase, sectionKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(`${backendBase}/api/upload-image?folder=${uploadFolder}`, formData, {
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
        `${backendBase}/api/home-sections/${sectionKey}`,
        {
          title,
          bannerImageUrl: nextUrl,
          bannerImagePublicId: nextPublicId,
          isActive: true,
        },
        { headers: { "Content-Type": "application/json", ...authHeaders() } }
      );

      if (res.data?.section) {
        setImageUrl(res.data.section.bannerImageUrl || "");
        setImagePublicId(res.data.section.bannerImagePublicId || "");
        setPendingFile(null);
        if (preview) URL.revokeObjectURL(preview);
        setPreview("");
      }

      setStatus({
        type: "ok",
        text: lang === "nl" ? "Afbeelding opgeslagen in MongoDB" : "Image saved to MongoDB",
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
            <div className="text-xl font-bold">{title}</div>
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

      <HeroImageUpload
        preview={preview || imageUrl}
        lang={lang}
        disabled={loading || saving}
        hint={hint}
        onFile={(file) => {
          if (preview) URL.revokeObjectURL(preview);
          setPendingFile(file);
          setPreview(URL.createObjectURL(file));
        }}
      />
    </div>
  );
}
