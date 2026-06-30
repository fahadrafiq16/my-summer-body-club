import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import { Save, RefreshCw, CheckCircle2, AlertCircle, ImageIcon, Plus, Trash2 } from "lucide-react";
import { getBackendBaseUrl } from "../../utils/backend";

const SECTION_KEY = "over-msbc";
const DEFAULT_SLOT_COUNT = 3;

function authHeaders() {
  try {
    const raw = localStorage.getItem("msbc_dashboard_auth");
    const token = raw ? JSON.parse(raw)?.token : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

function emptyImageItem(index = 0) {
  return {
    imageUrl: "",
    imagePublicId: "",
    linkUrl: "",
    displayOrder: index,
    _pendingFile: null,
    _preview: "",
  };
}

function normalizeItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return Array.from({ length: DEFAULT_SLOT_COUNT }, (_, i) => emptyImageItem(i));
  }
  return items.map((item, index) => ({
    imageUrl: item?.imageUrl || "",
    imagePublicId: item?.imagePublicId || "",
    linkUrl: "",
    displayOrder: Number.isFinite(Number(item?.displayOrder)) ? Number(item.displayOrder) : index,
    _pendingFile: null,
    _preview: "",
  }));
}

function ImageUpload({ preview, onFile, disabled }) {
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
      className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors min-h-[140px] flex items-center justify-center ${
        isDragActive ? "border-[#ef4d16] bg-orange-50" : "border-gray-200 hover:border-[#ef4d16] hover:bg-orange-50"
      } ${disabled ? "opacity-60 pointer-events-none" : ""}`}
    >
      <input {...getInputProps()} />
      {preview ? (
        <img src={preview} alt="" className="max-h-40 w-full object-cover rounded-lg" />
      ) : (
        <div className="text-sm text-gray-500 flex flex-col items-center gap-2">
          <ImageIcon className="w-8 h-8 text-gray-400" />
          <span>Sleep of klik om afbeelding te uploaden</span>
        </div>
      )}
    </div>
  );
}

export default function HomeOverMsbc({ lang = "nl", embedded = false }) {
  const backendBase = useMemo(() => getBackendBaseUrl(), []);
  const [images, setImages] = useState(() =>
    Array.from({ length: DEFAULT_SLOT_COUNT }, (_, i) => emptyImageItem(i))
  );
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
        setImages(normalizeItems(res.data.section.galleryItems));
      }
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Failed to load section");
      setImages(Array.from({ length: DEFAULT_SLOT_COUNT }, (_, i) => emptyImageItem(i)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [backendBase]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateItem = (index, patch) => {
    setImages((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const removeItem = (index) => {
    setImages((prev) => {
      const item = prev[index];
      if (item?._preview) URL.revokeObjectURL(item._preview);
      const next = prev.filter((_, i) => i !== index);
      return next.length > 0 ? next : [emptyImageItem(0)];
    });
  };

  const addItem = () => {
    setImages((prev) => [...prev, emptyImageItem(prev.length)]);
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(`${backendBase}/api/upload-image?folder=msbc/over-msbc`, formData, {
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

      const itemsToSave = [];
      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        let imageUrl = item.imageUrl || "";
        let imagePublicId = item.imagePublicId || "";

        if (item._pendingFile) {
          const uploaded = await uploadImage(item._pendingFile);
          imageUrl = uploaded.url;
          imagePublicId = uploaded.publicId;
        }

        if (!imageUrl && !imagePublicId) continue;

        itemsToSave.push({
          imageUrl,
          imagePublicId,
          linkUrl: "",
          displayOrder: itemsToSave.length,
        });
      }

      const res = await axios.put(
        `${backendBase}/api/home-sections/${SECTION_KEY}`,
        {
          title: "Over MSBC",
          galleryItems: itemsToSave,
          isActive: true,
        },
        { headers: { "Content-Type": "application/json", ...authHeaders() } }
      );

      if (res.data?.section) {
        setImages(normalizeItems(res.data.section.galleryItems));
      }

      setStatus({
        type: "ok",
        text: lang === "nl" ? "Over MSBC afbeeldingen opgeslagen" : "Over MSBC images saved",
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
            <div className="text-xl font-bold">Over MSBC</div>
            <div className="text-sm text-gray-500">
              {lang === "nl"
                ? "Slider-afbeeldingen rechts op de Over MSBC-pagina."
                : "Slider images on the right side of the Over MSBC page."}
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

      <p className="text-sm text-gray-500">
        {lang === "nl"
          ? "Afbeeldingen worden één voor één getoond in een slider op /over-msbc. Voeg zoveel afbeeldingen toe als je wilt."
          : "Images slide one by one on /over-msbc. Add as many images as you need."}
      </p>

      <div className="space-y-4">
        {images.map((item, index) => (
          <div key={index} className="rounded-xl border border-gray-200 p-4 bg-gray-50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-700">
                {lang === "nl" ? `Afbeelding ${index + 1}` : `Image ${index + 1}`}
              </div>
              <button
                type="button"
                className="text-red-600 hover:bg-red-50 rounded-lg p-2"
                onClick={() => removeItem(index)}
                disabled={loading || saving || images.length <= 1}
                aria-label="Remove image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <ImageUpload
              preview={item._preview || item.imageUrl}
              disabled={loading || saving}
              onFile={(file) => {
                if (item._preview) URL.revokeObjectURL(item._preview);
                updateItem(index, {
                  _pendingFile: file,
                  _preview: URL.createObjectURL(file),
                });
              }}
            />
          </div>
        ))}
      </div>

      <Button variant="outline" className="rounded-xl" onClick={addItem} disabled={loading || saving}>
        <Plus className="w-4 h-4 mr-2" />
        {lang === "nl" ? "Afbeelding toevoegen" : "Add image"}
      </Button>
    </div>
  );
}
