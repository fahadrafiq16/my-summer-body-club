import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import {
  Plus,
  RefreshCw,
  Trash2,
  Image as ImageIcon,
  Video,
  Film,
  Youtube,
  Save,
  X,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Pencil,
  Eye,
  EyeOff,
} from "lucide-react";
import { getBackendBaseUrl } from "../../utils/backend";
import {
  extractYoutubeVideoId,
  getYoutubeThumbnailUrl,
  toYoutubeEmbedUrl,
} from "../../pages/Fotos/galleryUtils";

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

function Field({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-medium text-gray-600 mb-1">{label}</span>
      {children}
    </label>
  );
}

function StatusBanner({ status }) {
  if (!status) return null;
  const isOk = status.type === "ok";
  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm inline-flex items-center gap-2 ${
        isOk ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {isOk ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
      {status.text}
    </div>
  );
}

function FeaturedImageUpload({ preview, onFile, disabled, hint }) {
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
      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors min-h-[180px] flex items-center justify-center ${
        isDragActive ? "border-[#ef4d16] bg-orange-50" : "border-gray-200 hover:border-[#ef4d16] hover:bg-orange-50"
      } ${disabled ? "opacity-60 pointer-events-none" : ""}`}
    >
      <input {...getInputProps()} />
      {preview ? (
        <img src={preview} alt="" className="max-h-52 w-auto h-auto mx-auto rounded-lg object-contain" />
      ) : (
        <div className="text-sm text-gray-500 flex flex-col items-center gap-2">
          <ImageIcon className="w-8 h-8 text-gray-400" />
          <span>{hint || "Sleep of klik om uitgelichte afbeelding te uploaden"}</span>
        </div>
      )}
    </div>
  );
}

function MediaItemsDropzone({ galleryType, onFiles, disabled, count }) {
  const isVideo = galleryType === "videos";

  const onDrop = (accepted) => {
    if (accepted?.length) onFiles(accepted);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: isVideo
      ? { "video/*": [".mp4", ".webm", ".mov"] }
      : { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"] },
    maxSize: isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024,
    multiple: true,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
        isDragActive ? "border-[#ef4d16] bg-orange-50" : "border-gray-200 hover:border-[#ef4d16] hover:bg-orange-50"
      } ${disabled ? "opacity-60 pointer-events-none" : ""}`}
    >
      <input {...getInputProps()} />
      <div className="text-sm text-gray-500 flex flex-col items-center gap-2">
        {isVideo ? <Film className="w-8 h-8 text-gray-400" /> : <ImageIcon className="w-8 h-8 text-gray-400" />}
        <span className="font-medium text-gray-700">
          {isVideo ? "Video's toevoegen" : "Foto's toevoegen"}
        </span>
        <span>
          {isVideo
            ? "Sleep bestanden hierheen of klik (MP4, max 50 MB)"
            : "Sleep bestanden hierheen of klik (PNG, JPG, WEBP, max 5 MB)"}
        </span>
        {count > 0 && (
          <span className="text-xs text-[#ef4d16] font-medium mt-1">
            {count} {isVideo ? "video" : "foto"}{count !== 1 ? (isVideo ? "'s" : "'s") : ""} in deze gallery
          </span>
        )}
      </div>
    </div>
  );
}

function MediaThumb({ item, index, isPending, onRemove, disabled }) {
  const src = isPending ? item.preview || item.mediaUrl : item.mediaUrl;
  const isVideo = item.mediaType === "video";
  const youtubeId = isVideo ? extractYoutubeVideoId(item.mediaUrl || src) : "";
  const isYoutube = Boolean(youtubeId);
  const youtubeThumb = isYoutube ? getYoutubeThumbnailUrl(youtubeId) : "";

  return (
    <div
      className={`relative group rounded-xl overflow-hidden border bg-white aspect-square ${
        isPending ? "border-[#ef4d16] border-2" : "border-gray-200"
      }`}
    >
      {isYoutube ? (
        <>
          <img src={youtubeThumb} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
              <Youtube className="w-5 h-5 text-white" />
            </div>
          </div>
        </>
      ) : isVideo ? (
        <video src={src} className="w-full h-full object-cover" muted />
      ) : (
        <img src={src} alt="" className="w-full h-full object-cover" />
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={onRemove}
        className="absolute top-2 right-2 rounded-lg border border-red-200 bg-white/95 p-1.5 text-red-600 opacity-0 group-hover:opacity-100 transition hover:bg-red-50 disabled:opacity-50"
        aria-label="Verwijderen"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
      <span
        className={`absolute bottom-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
          isPending ? "bg-[#ef4d16] text-white" : "bg-gray-900/70 text-white"
        }`}
      >
        {isPending ? "Nieuw" : `#${index + 1}`}
      </span>
    </div>
  );
}

const emptyForm = () => ({
  id: null,
  title: "",
  galleryType: "photos",
  featuredImageUrl: "",
  featuredImagePublicId: "",
  items: [],
  displayOrder: 0,
  isActive: true,
});

export default function FotosGalleryAdmin() {
  const backendBase = useMemo(() => getBackendBaseUrl(), []);
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);
  const [typePickerOpen, setTypePickerOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [pendingFeatured, setPendingFeatured] = useState(null);
  const [featuredPreview, setFeaturedPreview] = useState("");
  const [pendingItems, setPendingItems] = useState([]);
  const [youtubeInput, setYoutubeInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${backendBase}/api/fotos-galleries/all`, { headers: authHeaders() });
      if (res.data?.success) setGalleries(res.data.galleries || []);
      else setGalleries([]);
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Galleries laden mislukt");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [backendBase]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetEditor = () => {
    if (featuredPreview?.startsWith("blob:")) URL.revokeObjectURL(featuredPreview);
    pendingItems.forEach((p) => {
      if (p.preview?.startsWith("blob:")) URL.revokeObjectURL(p.preview);
    });
    setForm(emptyForm());
    setPendingFeatured(null);
    setFeaturedPreview("");
    setPendingItems([]);
    setYoutubeInput("");
    setEditorOpen(false);
    setStatus(null);
  };

  const openCreate = (galleryType) => {
    setTypePickerOpen(false);
    setForm({ ...emptyForm(), galleryType });
    setFeaturedPreview("");
    setPendingFeatured(null);
    setPendingItems([]);
    setYoutubeInput("");
    setEditorOpen(true);
    setStatus(null);
  };

  const openEdit = (gallery) => {
    setForm({
      id: gallery.id,
      title: gallery.title || "",
      galleryType: gallery.galleryType,
      featuredImageUrl: gallery.featuredImageUrl || "",
      featuredImagePublicId: gallery.featuredImagePublicId || "",
      items: gallery.items || [],
      displayOrder: gallery.displayOrder ?? 0,
      isActive: gallery.isActive !== false,
    });
    setFeaturedPreview(gallery.featuredImageUrl || "");
    setPendingFeatured(null);
    setPendingItems([]);
    setYoutubeInput("");
    setEditorOpen(true);
    setStatus(null);
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(`${backendBase}/api/upload-image?folder=msbc/fotos-galleries`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (!res.data?.success) throw new Error(res.data?.error || "Afbeelding uploaden mislukt");
    return { url: res.data.url, publicId: res.data.publicId };
  };

  const uploadVideo = async (file) => {
    const formData = new FormData();
    formData.append("video", file);
    const res = await axios.post(`${backendBase}/api/upload-video?folder=msbc/fotos-videos`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (!res.data?.success) throw new Error(res.data?.error || "Video uploaden mislukt");
    return { url: res.data.url, publicId: res.data.publicId };
  };

  const onFeaturedFile = (file) => {
    if (featuredPreview?.startsWith("blob:")) URL.revokeObjectURL(featuredPreview);
    setPendingFeatured(file);
    setFeaturedPreview(URL.createObjectURL(file));
  };

  const onItemsFiles = (files) => {
    const isVideo = form.galleryType === "videos";
    const next = files.map((file, i) => ({
      file,
      preview: URL.createObjectURL(file),
      mediaType: isVideo ? "video" : "image",
      key: `${Date.now()}-${i}`,
    }));
    setPendingItems((prev) => [...prev, ...next]);
  };

  const addYoutubeVideo = () => {
    const embed = toYoutubeEmbedUrl(youtubeInput);
    if (!embed || !embed.includes("youtube.com/embed/")) {
      setStatus({ type: "err", text: "Ongeldige YouTube URL. Gebruik een watch-, embed- of youtu.be-link." });
      return;
    }
    setStatus(null);
    setPendingItems((prev) => [
      ...prev,
      {
        key: `yt-${Date.now()}`,
        source: "youtube",
        mediaType: "video",
        mediaUrl: embed,
        preview: getYoutubeThumbnailUrl(embed),
      },
    ]);
    setYoutubeInput("");
  };

  const removeExistingItem = (index) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const removePendingItem = (key) => {
    setPendingItems((prev) => {
      const item = prev.find((p) => p.key === key);
      if (item?.preview?.startsWith("blob:")) URL.revokeObjectURL(item.preview);
      return prev.filter((p) => p.key !== key);
    });
  };

  const save = async () => {
    if (!form.title.trim()) {
      setStatus({ type: "err", text: "Titel is verplicht" });
      return;
    }
    try {
      setSaving(true);
      setStatus(null);
      let featuredImageUrl = form.featuredImageUrl;
      let featuredImagePublicId = form.featuredImagePublicId;

      if (pendingFeatured) {
        const uploaded = await uploadImage(pendingFeatured);
        featuredImageUrl = uploaded.url;
        featuredImagePublicId = uploaded.publicId;
      }

      const uploadedItems = [];
      for (let i = 0; i < pendingItems.length; i++) {
        const p = pendingItems[i];
        if (p.source === "youtube") {
          uploadedItems.push({
            mediaUrl: p.mediaUrl,
            mediaPublicId: "",
            mediaType: "video",
            displayOrder: form.items.length + uploadedItems.length,
          });
          continue;
        }
        const uploaded =
          p.mediaType === "video" ? await uploadVideo(p.file) : await uploadImage(p.file);
        uploadedItems.push({
          mediaUrl: uploaded.url,
          mediaPublicId: uploaded.publicId,
          mediaType: p.mediaType,
          displayOrder: form.items.length + uploadedItems.length,
        });
      }

      const items = [...form.items, ...uploadedItems].map((item, index) => ({
        ...item,
        displayOrder: index,
      }));

      const payload = {
        title: form.title.trim(),
        galleryType: form.galleryType,
        featuredImageUrl,
        featuredImagePublicId,
        items,
        displayOrder: form.displayOrder,
        isActive: form.isActive,
      };

      if (form.id) {
        await axios.put(`${backendBase}/api/fotos-galleries/${form.id}`, payload, { headers: authHeaders() });
        setStatus({ type: "ok", text: "Gallery bijgewerkt" });
      } else {
        await axios.post(`${backendBase}/api/fotos-galleries`, payload, { headers: authHeaders() });
        setStatus({ type: "ok", text: "Gallery aangemaakt" });
      }

      resetEditor();
      await load();
    } catch (e) {
      setStatus({ type: "err", text: e?.response?.data?.error || e?.message || "Opslaan mislukt" });
    } finally {
      setSaving(false);
    }
  };

  const removeGallery = async (id) => {
    if (!window.confirm("Deze gallery verwijderen?")) return;
    try {
      setDeletingId(id);
      await axios.delete(`${backendBase}/api/fotos-galleries/${id}`, { headers: authHeaders() });
      setStatus({ type: "ok", text: "Gallery verwijderd" });
      await load();
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Verwijderen mislukt");
    } finally {
      setDeletingId(null);
    }
  };

  const photoGalleries = galleries.filter((g) => g.galleryType === "photos");
  const videoGalleries = galleries.filter((g) => g.galleryType === "videos");

  const renderGalleryList = (list, label, icon) => (
    <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-lg font-semibold text-gray-900">{label}</h2>
          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{list.length}</span>
        </div>

        {list.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">Nog geen galleries. Klik op &quot;Nieuwe gallery&quot; om te beginnen.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((g) => (
              <div
                key={g.id}
                className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50 hover:border-[#ef4d16]/40 hover:shadow-sm transition"
              >
                <div className="aspect-[4/3] bg-gray-100 relative">
                  {g.featuredImageUrl ? (
                    <img src={g.featuredImageUrl} alt={g.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                  <span
                    className={`absolute top-2 left-2 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full ${
                      g.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {g.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {g.isActive ? "Zichtbaar" : "Verborgen"}
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <p className="font-semibold text-gray-900 truncate">{g.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {g.items?.length || 0} {g.galleryType === "videos" ? "video's" : "foto's"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-lg flex-1"
                      onClick={() => openEdit(g)}
                    >
                      <Pencil className="w-3.5 h-3.5 mr-1.5" />
                      Bewerken
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-lg text-red-600 border-red-200 hover:bg-red-50"
                      disabled={deletingId === g.id}
                      onClick={() => removeGallery(g.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const totalItems = form.items.length + pendingItems.length;

  const youtubeInputPreview = useMemo(() => {
    if (!youtubeInput.trim()) return "";
    const embed = toYoutubeEmbedUrl(youtubeInput);
    return getYoutubeThumbnailUrl(embed);
  }, [youtubeInput]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-2xl font-bold">Gallery</div>
          <div className="text-sm text-gray-500">
            Beheer foto- en video-galleries voor de /fotos pagina (opgeslagen in MongoDB).
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="rounded-xl" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Verversen
          </Button>
          <Button className="rounded-xl bg-[#ef4d16] hover:bg-[#d23f0f] text-white" onClick={() => setTypePickerOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nieuwe gallery
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 inline-flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}
      {status && !editorOpen && <StatusBanner status={status} />}

      {loading ? (
        <div className="text-sm text-gray-500">Laden...</div>
      ) : (
        <div className="space-y-6">
          {renderGalleryList(photoGalleries, "Foto galleries", <ImageIcon className="w-5 h-5 text-[#ef4d16]" />)}
          {renderGalleryList(videoGalleries, "Video galleries", <Video className="w-5 h-5 text-[#ef4d16]" />)}
        </div>
      )}

      {typePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md bg-white shadow-xl border border-gray-200 rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Nieuwe gallery</h2>
                <button
                  type="button"
                  onClick={() => setTypePickerOpen(false)}
                  className="rounded-lg p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500">Welk type gallery wil je aanmaken?</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => openCreate("photos")}
                  className="flex flex-col items-center gap-3 rounded-xl border-2 border-gray-200 bg-gray-50 p-6 hover:border-[#ef4d16] hover:bg-orange-50 transition"
                >
                  <ImageIcon className="w-10 h-10 text-[#ef4d16]" />
                  <span className="font-semibold text-sm text-gray-900">Foto gallery</span>
                </button>
                <button
                  type="button"
                  onClick={() => openCreate("videos")}
                  className="flex flex-col items-center gap-3 rounded-xl border-2 border-gray-200 bg-gray-50 p-6 hover:border-[#ef4d16] hover:bg-orange-50 transition"
                >
                  <Video className="w-10 h-10 text-[#ef4d16]" />
                  <span className="font-semibold text-sm text-gray-900">Video gallery</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {editorOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 py-8">
          <div className="w-full max-w-3xl space-y-4">
            <Card className="bg-white shadow-xl border border-gray-200 rounded-2xl">
              <CardContent className="p-6 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <button
                      type="button"
                      onClick={resetEditor}
                      className="inline-flex items-center text-sm text-gray-500 hover:text-gray-800 mb-2"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Terug
                    </button>
                    <h2 className="text-xl font-bold text-gray-900">
                      {form.id ? "Gallery bewerken" : "Nieuwe gallery"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {form.galleryType === "videos" ? "Video gallery" : "Foto gallery"} · /fotos pagina
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetEditor}
                    className="rounded-lg p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <StatusBanner status={status} />

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-4">
                  <h3 className="text-sm font-semibold text-gray-800">Algemeen</h3>
                  <Field label="Gallery titel">
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                      className={inputCls}
                      placeholder="bijv. Bootcamp 2025"
                      disabled={saving}
                    />
                  </Field>

                  <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3">
                    <div>
                      <div className="text-sm font-medium text-gray-800">Tonen op /fotos</div>
                      <div className="text-xs text-gray-500">Zichtbaar voor bezoekers op de website</div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={form.isActive}
                      disabled={saving}
                      onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
                      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#ef4d16] focus:ring-offset-2 disabled:opacity-60 ${
                        form.isActive ? "bg-[#ef4d16]" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                          form.isActive ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">Uitgelichte afbeelding</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Wordt getoond op de /fotos pagina als cover van deze gallery.
                    </p>
                  </div>
                  <FeaturedImageUpload
                    preview={featuredPreview}
                    onFile={onFeaturedFile}
                    disabled={saving}
                  />
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                      {form.galleryType === "videos" ? "Video's in gallery" : "Foto's in gallery"}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Upload meerdere bestanden tegelijk via drag & drop.
                    </p>
                  </div>

                  <MediaItemsDropzone
                    galleryType={form.galleryType}
                    onFiles={onItemsFiles}
                    disabled={saving}
                    count={totalItems}
                  />

                  {form.galleryType === "videos" && (
                    <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                        <Youtube className="w-4 h-4 text-red-500" />
                        YouTube video toevoegen
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={youtubeInput}
                          onChange={(e) => setYoutubeInput(e.target.value)}
                          className={inputCls}
                          placeholder="https://www.youtube.com/watch?v=..."
                          disabled={saving}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-lg shrink-0"
                          onClick={addYoutubeVideo}
                          disabled={saving || !youtubeInput.trim()}
                        >
                          <Plus className="w-4 h-4 mr-1.5" />
                          Toevoegen
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400">
                        Embed-, watch- of youtu.be-link — wordt automatisch omgezet naar een embed.
                      </p>
                      {youtubeInputPreview && (
                        <div className="rounded-xl overflow-hidden border border-gray-200 aspect-video max-w-xs bg-gray-100">
                          <img
                            src={youtubeInputPreview}
                            alt="YouTube preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {(form.items.length > 0 || pendingItems.length > 0) && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {form.items.map((item, index) => (
                        <MediaThumb
                          key={`existing-${index}`}
                          item={item}
                          index={index}
                          isPending={false}
                          disabled={saving}
                          onRemove={() => removeExistingItem(index)}
                        />
                      ))}
                      {pendingItems.map((item, index) => (
                        <MediaThumb
                          key={item.key}
                          item={item}
                          index={form.items.length + index}
                          isPending
                          disabled={saving}
                          onRemove={() => removePendingItem(item.key)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <Button variant="outline" className="rounded-xl" onClick={resetEditor} disabled={saving}>
                    Annuleren
                  </Button>
                  <Button
                    className="rounded-xl bg-[#ef4d16] hover:bg-[#d23f0f] text-white"
                    onClick={save}
                    disabled={saving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Opslaan…" : "Opslaan"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
