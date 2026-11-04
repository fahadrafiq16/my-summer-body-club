import React, { useEffect, useMemo, useRef, useState } from "react";
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
  const [galleryVideos, setGalleryVideos] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [videoLibraryError, setVideoLibraryError] = useState('');
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const videoInput = useRef(null);
  const [deletingVideo, setDeletingVideo] = useState(false);

  const deleteVideo = async (video) => {
    if (!window.confirm(lang === 'nl'
      ? 'Deze video definitief verwijderen uit Cloudinary en de website? Dit kan niet ongedaan worden gemaakt.'
      : 'Permanently delete this video from Cloudinary and the website? This cannot be undone.')) return;
    setSaving(true);
    setDeletingVideo(true);
    setError('');
    setStatus(null);
    try {
      const response = await axios.delete(`${backendBase}/api/gallery-videos`, {
        headers: authHeaders(), data: { publicId: video.videoPublicId },
      });
      if (!response.data?.success) throw new Error('Video deletion failed');
      const keep = (item) => item.videoPublicId !== video.videoPublicId;
      setGalleryVideos((previous) => previous.filter(keep));
      setUploadedVideos((previous) => previous.filter(keep));
      setStatus({ type: 'ok', text: lang === 'nl' ? 'Video verwijderd uit Cloudinary en de gallery.' : 'Video deleted from Cloudinary and the gallery.' });
    } catch (e) {
      setError(e?.response?.data?.error || e.message || 'Video deletion failed');
    } finally {
      setDeletingVideo(false);
      setSaving(false);
    }
  };

  const addVideo = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!['video/mp4', 'video/webm', 'video/quicktime'].includes(file.type) || file.size > 50 * 1024 * 1024) {
      setError(lang === 'nl' ? 'Kies een MP4, WebM of MOV video van maximaal 50 MB.' : 'Choose an MP4, WebM or MOV video up to 50 MB.');
      return;
    }
    setUploadingVideo(true);
    setUploadProgress(0);
    setError('');
    setStatus(null);
    try {
      const form = new FormData();
      form.append('video', file);
      const response = await axios.post(`${backendBase}/api/upload-video?folder=msbc/gallery-videos`, form, {
        headers: authHeaders(),
        onUploadProgress: ({ loaded, total }) => setUploadProgress(total ? Math.round(loaded * 100 / total) : 0),
      });
      if (!response.data?.success || !response.data.url) throw new Error('Video upload failed');
      setUploadedVideos((previous) => [...previous, {
        videoUrl: response.data.url,
        videoPublicId: response.data.publicId,
        title: file.name.replace(/\.[^.]+$/, ''),
      }]);
      setGalleryVideos((previous) => [...previous, {
        videoUrl: response.data.url,
        videoPublicId: response.data.publicId,
        title: file.name.replace(/\.[^.]+$/, ''),
      }]);
      setStatus({ type: 'ok', text: lang === 'nl' ? 'Video geüpload. Klik op Opslaan om te publiceren.' : 'Video uploaded. Click Save to publish.' });
    } catch (e) {
      setError(e?.response?.data?.error || e.message || 'Video upload failed');
    } finally {
      setUploadingVideo(false);
    }
  };

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      setVideoLibraryError('');
      try {
        const library = await axios.get(`${backendBase}/api/gallery-videos`, { headers: authHeaders() });
        if (!library.data?.success || !Array.isArray(library.data.videos)) throw new Error('Invalid video library');
        setUploadedVideos(library.data.videos);
      } catch {
        setVideoLibraryError(lang === 'nl' ? 'Cloudinary-video’s konden niet worden geladen. Klik op Verversen om opnieuw te proberen.' : 'Could not load Cloudinary videos. Click Refresh to try again.');
      }
      const res = await axios.get(`${backendBase}/api/fetch-home-section/${SECTION_KEY}`);
      if (res.data?.success && res.data.section) {
        const section = res.data.section;
        setPhotosButtonUrl(section.photosButtonUrl || DEFAULT_PHOTOS_URL);
        setVideosButtonUrl(section.videosButtonUrl || DEFAULT_VIDEOS_URL);
        setGalleryItems(padGalleryItems(section.galleryItems));
        setGalleryVideos(section.galleryVideos || []);
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
          galleryVideos,
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
          <Button variant="outline" className="rounded-xl" onClick={load} disabled={loading || saving || uploadingVideo}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            {lang === "nl" ? "Verversen" : "Refresh"}
          </Button>
          <Button className="rounded-xl bg-[#ef4d16] hover:bg-[#d94412]" onClick={save} disabled={loading || saving || uploadingVideo}>
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

      <div className="rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="font-semibold">Videos</h3>
          <Button type="button" variant="outline" onClick={() => videoInput.current?.click()} disabled={loading || saving || uploadingVideo}>
            {lang === 'nl' ? 'Nieuwe video toevoegen' : 'Add new video'}
          </Button>
          <input ref={videoInput} type="file" accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov" onChange={addVideo} className="hidden" />
        </div>
        <p className="text-xs text-gray-500">MP4 / WebM / MOV · Max. 50 MB. {lang === 'nl' ? 'Klik na het uploaden op Opslaan.' : 'Click Save after uploading.'}</p>
        {uploadingVideo && <p role="status" className="text-sm text-orange-700">{uploadProgress < 100 ? `Upload: ${uploadProgress}%` : lang === 'nl' ? 'Video verwerken…' : 'Processing video…'}</p>}
        {deletingVideo && <p role="status" className="text-sm text-orange-700">{lang === 'nl' ? 'Video verwijderen…' : 'Deleting video…'}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {galleryVideos.map((video, index) => (
            <div key={video.videoPublicId || video.videoUrl} className="space-y-2">
              <video src={video.videoUrl} controls playsInline preload="metadata" className="w-full aspect-video rounded-lg bg-black" aria-label={video.title || `Video ${index + 1}`} />
              <input className={inputCls} aria-label={lang === 'nl' ? 'Videotitel' : 'Video title'} value={video.title} disabled={saving || uploadingVideo} onChange={(event) => setGalleryVideos((previous) => previous.map((item, i) => i === index ? { ...item, title: event.target.value } : item))} />
              <Button type="button" variant="outline" disabled={saving || uploadingVideo} onClick={() => setGalleryVideos((previous) => previous.filter((_, i) => i !== index))}>{lang === 'nl' ? 'Verwijderen' : 'Remove'}</Button>
              <Button type="button" variant="outline" className="text-red-600 border-red-200" disabled={loading || saving || uploadingVideo || !video.videoPublicId} onClick={() => deleteVideo(video)}>{lang === 'nl' ? 'Definitief verwijderen' : 'Delete permanently'}</Button>
            </div>
          ))}
        </div>
        <h4 className="font-semibold text-sm">{lang === 'nl' ? 'Overige uploads in Cloudinary' : 'Other Cloudinary uploads'}</h4>
        <p className="text-xs text-gray-500">{lang === 'nl' ? 'Deze video’s zijn al geüpload. Voeg ze toe aan de gallery en klik op Opslaan om ze te publiceren.' : 'These videos are already uploaded. Add them to the gallery and click Save to publish.'}</p>
        {videoLibraryError && <p role="alert" className="text-sm text-red-700">{videoLibraryError}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {uploadedVideos.filter((video) => !galleryVideos.some((item) => item.videoUrl === video.videoUrl || (item.videoPublicId && item.videoPublicId === video.videoPublicId))).map((video) => (
            <div key={video.videoPublicId || video.videoUrl} className="space-y-2">
              <video src={video.videoUrl} controls playsInline preload="metadata" className="w-full aspect-video rounded-lg bg-black" aria-label={video.title || 'Uploaded video'} />
              <p className="text-sm break-words">{video.title}</p>
              <Button type="button" variant="outline" disabled={loading || saving || uploadingVideo} onClick={() => setGalleryVideos((previous) => [...previous, video])}>{lang === 'nl' ? 'Toevoegen aan gallery' : 'Add to gallery'}</Button>
              <Button type="button" variant="outline" className="text-red-600 border-red-200" disabled={loading || saving || uploadingVideo || !video.videoPublicId} onClick={() => deleteVideo(video)}>{lang === 'nl' ? 'Definitief verwijderen' : 'Delete permanently'}</Button>
            </div>
          ))}
        </div>
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
