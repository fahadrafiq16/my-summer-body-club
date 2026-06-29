import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import { Save, RefreshCw, CheckCircle2, AlertCircle, ImageIcon } from "lucide-react";
import { getBackendBaseUrl } from "../../utils/backend";

const SECTION_KEY = "popup-video-area";
const DEFAULT_EMBED = "https://www.youtube.com/embed/3A8X8O4dT5E";

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

function ImageUpload({ label, preview, onFile, disabled }) {
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
      <span className="block text-xs font-medium text-gray-600 mb-1">{label}</span>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors min-h-[140px] flex items-center justify-center ${
          isDragActive ? "border-[#ef4d16] bg-orange-50" : "border-gray-200 hover:border-[#ef4d16] hover:bg-orange-50"
        } ${disabled ? "opacity-60 pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <img src={preview} alt="" className="max-h-44 w-auto h-auto mx-auto rounded-lg object-contain" />
        ) : (
          <div className="text-sm text-gray-500 flex flex-col items-center gap-2">
            <ImageIcon className="w-8 h-8 text-gray-400" />
            <span>Sleep of klik om te uploaden</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePopUpVideo({ lang = "nl", embedded = false }) {
  const backendBase = useMemo(() => getBackendBaseUrl(), []);
  const [youtubeUrl, setYoutubeUrl] = useState(DEFAULT_EMBED);
  const [leftImageUrl, setLeftImageUrl] = useState("");
  const [leftImagePublicId, setLeftImagePublicId] = useState("");
  const [rightImageUrl, setRightImageUrl] = useState("");
  const [rightImagePublicId, setRightImagePublicId] = useState("");
  const [pendingLeftFile, setPendingLeftFile] = useState(null);
  const [pendingRightFile, setPendingRightFile] = useState(null);
  const [leftPreview, setLeftPreview] = useState("");
  const [rightPreview, setRightPreview] = useState("");
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
        setYoutubeUrl(section.youtubeEmbedUrl || DEFAULT_EMBED);
        setLeftImageUrl(section.leftImageUrl || "");
        setLeftImagePublicId(section.leftImagePublicId || "");
        setRightImageUrl(section.rightImageUrl || "");
        setRightImagePublicId(section.rightImagePublicId || "");
        setPendingLeftFile(null);
        setPendingRightFile(null);
        if (leftPreview) URL.revokeObjectURL(leftPreview);
        if (rightPreview) URL.revokeObjectURL(rightPreview);
        setLeftPreview("");
        setRightPreview("");
      }
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Failed to load section");
      setYoutubeUrl(DEFAULT_EMBED);
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
    const res = await axios.post(`${backendBase}/api/upload-image?folder=msbc/popup-video`, formData, {
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

      let nextLeftUrl = leftImageUrl;
      let nextLeftPublicId = leftImagePublicId;
      let nextRightUrl = rightImageUrl;
      let nextRightPublicId = rightImagePublicId;

      if (pendingLeftFile) {
        const uploaded = await uploadImage(pendingLeftFile);
        nextLeftUrl = uploaded.url;
        nextLeftPublicId = uploaded.publicId;
      }

      if (pendingRightFile) {
        const uploaded = await uploadImage(pendingRightFile);
        nextRightUrl = uploaded.url;
        nextRightPublicId = uploaded.publicId;
      }

      const res = await axios.put(
        `${backendBase}/api/home-sections/${SECTION_KEY}`,
        {
          title: "Popup Video Area",
          youtubeEmbedUrl: youtubeUrl.trim(),
          leftImageUrl: nextLeftUrl,
          leftImagePublicId: nextLeftPublicId,
          rightImageUrl: nextRightUrl,
          rightImagePublicId: nextRightPublicId,
          isActive: true,
        },
        { headers: { "Content-Type": "application/json", ...authHeaders() } }
      );

      if (res.data?.section) {
        const section = res.data.section;
        setYoutubeUrl(section.youtubeEmbedUrl || DEFAULT_EMBED);
        setLeftImageUrl(section.leftImageUrl || "");
        setLeftImagePublicId(section.leftImagePublicId || "");
        setRightImageUrl(section.rightImageUrl || "");
        setRightImagePublicId(section.rightImagePublicId || "");
        setPendingLeftFile(null);
        setPendingRightFile(null);
        if (leftPreview) URL.revokeObjectURL(leftPreview);
        if (rightPreview) URL.revokeObjectURL(rightPreview);
        setLeftPreview("");
        setRightPreview("");
      }

      setStatus({
        type: "ok",
        text: lang === "nl" ? "Popup Video Area opgeslagen in MongoDB" : "Popup Video Area saved to MongoDB",
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
            <div className="text-xl font-bold">Popup Video Area</div>
            <div className="text-sm text-gray-500">
              {lang === "nl"
                ? "Linker/rechter banner en popup YouTube-video."
                : "Left/right banners and popup YouTube video."}
            </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ImageUpload
          label={lang === "nl" ? "Linker banner (PT)" : "Left banner (PT)"}
          preview={leftPreview || leftImageUrl}
          disabled={loading || saving}
          onFile={(file) => {
            if (leftPreview) URL.revokeObjectURL(leftPreview);
            setPendingLeftFile(file);
            setLeftPreview(URL.createObjectURL(file));
          }}
        />
        <ImageUpload
          label={lang === "nl" ? "Rechter banner (Afvallen)" : "Right banner (Afvallen)"}
          preview={rightPreview || rightImageUrl}
          disabled={loading || saving}
          onFile={(file) => {
            if (rightPreview) URL.revokeObjectURL(rightPreview);
            setPendingRightFile(file);
            setRightPreview(URL.createObjectURL(file));
          }}
        />
      </div>

      <label className="block">
        <span className="block text-xs font-medium text-gray-600 mb-1">
          {lang === "nl" ? "Popup YouTube-link" : "Popup YouTube link"}
        </span>
        <input
          className={inputCls}
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="https://www.youtube.com/embed/3A8X8O4dT5E"
          disabled={loading}
        />
        <span className="block text-xs text-gray-400 mt-1">
          {lang === "nl"
            ? "Embed-URL, watch-URL of youtu.be-link — wordt automatisch omgezet."
            : "Embed URL, watch URL or youtu.be link — converted automatically."}
        </span>
      </label>

      {youtubeUrl && (
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-black">
          <div className="relative pt-[56.25%]">
            <iframe
              title="Preview"
              src={youtubeUrl}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
