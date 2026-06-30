import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import { Save, RefreshCw, CheckCircle2, AlertCircle, ImageIcon } from "lucide-react";
import { getBackendBaseUrl } from "../../utils/backend";

const SECTION_KEY = "gallery";
const GALLERY_COUNT = 5;
const DEFAULT_PHOTOS_URL = "/fotos";
const DEFAULT_VIDEOS_URL = "/fotos";

const DEFAULT_LINKS = [
  "https://mysummerbodyclub.nl/trainingfotos/meeting-the-best-2/",
  "https://mysummerbodyclub.nl/trainingfotos/naomy-burnet-sap-cup-2108/",
  "https://mysummerbodyclub.nl/trainingfotos/gabrielle-golds-gym-classic-2018/",
  "https://mysummerbodyclub.nl/trainingfotos/de-nieuwe-lichting/",
  "https://mysummerbodyclub.nl/trainingfotos/de-nieuwe-lichting/",
];

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

function emptyGalleryItem(index = 0) {
  return {
    imageUrl: "",
    imagePublicId: "",
    linkUrl: DEFAULT_LINKS[index] || "",
    displayOrder: index,
    _pendingFile: null,
    _preview: "",
  };
}

function padGalleryItems(items) {
  const normalized = Array.isArray(items) ? items : [];
  return Array.from({ length: GALLERY_COUNT }, (_, index) => {
    const existing = normalized[index] || {};
    return {
      imageUrl: existing.imageUrl || "",
      imagePublicId: existing.imagePublicId || "",
      linkUrl: existing.linkUrl || DEFAULT_LINKS[index] || "",
      displayOrder: index,
      _pendingFile: null,
      _preview: "",
    };
  });
}

function GalleryImageUpload({ label, preview, onFile, disabled }) {
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
        className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors min-h-[120px] flex items-center justify-center ${
          isDragActive ? "border-[#ef4d16] bg-orange-50" : "border-gray-200 hover:border-[#ef4d16] hover:bg-orange-50"
        } ${disabled ? "opacity-60 pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <img src={preview} alt="" className="max-h-32 w-full object-cover rounded-lg" />
        ) : (
          <div className="text-sm text-gray-500 flex flex-col items-center gap-2">
            <ImageIcon className="w-7 h-7 text-gray-400" />
            <span>Upload afbeelding</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomeGallery({ lang = "nl", embedded = false }) {
  const backendBase = useMemo(() => getBackendBaseUrl(), []);
  const [photosButtonUrl, setPhotosButtonUrl] = useState(DEFAULT_PHOTOS_URL);
  const [videosButtonUrl, setVideosButtonUrl] = useState(DEFAULT_VIDEOS_URL);
  const [galleryItems, setGalleryItems] = useState(() => Array.from({ length: GALLERY_COUNT }, (_, i) => emptyGalleryItem(i)));
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
        setPhotosButtonUrl(section.photosButtonUrl || DEFAULT_PHOTOS_URL);
        setVideosButtonUrl(section.videosButtonUrl || DEFAULT_VIDEOS_URL);
        setGalleryItems(padGalleryItems(section.galleryItems));
      }
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Failed to load gallery");
      setGalleryItems(Array.from({ length: GALLERY_COUNT }, (_, i) => emptyGalleryItem(i)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [backendBase]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateItem = (index, patch) => {
    setGalleryItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(`${backendBase}/api/upload-image?folder=msbc/gallery`, formData, {
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
      for (let i = 0; i < galleryItems.length; i++) {
        const item = galleryItems[i];
        let imageUrl = item.imageUrl || "";
        let imagePublicId = item.imagePublicId || "";

        if (item._pendingFile) {
          const uploaded = await uploadImage(item._pendingFile);
          imageUrl = uploaded.url;
          imagePublicId = uploaded.publicId;
        }

        itemsToSave.push({
          imageUrl,
          imagePublicId,
          linkUrl: item.linkUrl?.trim() || "",
          displayOrder: i,
        });
      }

      const res = await axios.put(
        `${backendBase}/api/home-sections/${SECTION_KEY}`,
        {
          title: "Gallery",
          photosButtonUrl: photosButtonUrl.trim(),
          videosButtonUrl: videosButtonUrl.trim(),
          galleryItems: itemsToSave,
          isActive: true,
        },
        { headers: { "Content-Type": "application/json", ...authHeaders() } }
      );

      if (res.data?.section) {
        setPhotosButtonUrl(res.data.section.photosButtonUrl || DEFAULT_PHOTOS_URL);
        setVideosButtonUrl(res.data.section.videosButtonUrl || DEFAULT_VIDEOS_URL);
        setGalleryItems(padGalleryItems(res.data.section.galleryItems));
      }

      setStatus({
        type: "ok",
        text: lang === "nl" ? "Gallery opgeslagen in MongoDB" : "Gallery saved to MongoDB",
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
            <div className="text-xl font-bold">Gallery</div>
            <div className="text-sm text-gray-500">
              {lang === "nl"
                ? "Photos/Videos knoppen en 5 gallery-afbeeldingen met links."
                : "Photos/Videos buttons and 5 gallery images with links."}
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
        <label className="block">
          <span className="block text-xs font-medium text-gray-600 mb-1">Photos button link</span>
          <input
            className={inputCls}
            value={photosButtonUrl}
            onChange={(e) => setPhotosButtonUrl(e.target.value)}
            placeholder={DEFAULT_PHOTOS_URL}
            disabled={loading}
          />
        </label>
        <label className="block">
          <span className="block text-xs font-medium text-gray-600 mb-1">Videos button link</span>
          <input
            className={inputCls}
            value={videosButtonUrl}
            onChange={(e) => setVideosButtonUrl(e.target.value)}
            placeholder={DEFAULT_VIDEOS_URL}
            disabled={loading}
          />
        </label>
      </div>

      <div className="space-y-4">
        {galleryItems.map((item, index) => (
          <div key={index} className="rounded-xl border border-gray-200 p-4 bg-gray-50 space-y-3">
            <div className="text-sm font-semibold text-gray-700">Afbeelding {index + 1}</div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <GalleryImageUpload
                label={`Gallery image ${index + 1}`}
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
              <label className="block">
                <span className="block text-xs font-medium text-gray-600 mb-1">Link bij klik</span>
                <input
                  className={inputCls}
                  value={item.linkUrl}
                  onChange={(e) => updateItem(index, { linkUrl: e.target.value })}
                  placeholder={DEFAULT_LINKS[index]}
                  disabled={loading}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
