import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, Trash2, Save, RefreshCw, CheckCircle2, AlertCircle, ImageIcon } from "lucide-react";
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

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#ef4d16]";

function emptySlide(order = 0) {
  return {
    _id: null,
    text1: "",
    text2: "",
    imageUrl: "",
    imagePublicId: "",
    displayOrder: order,
    isActive: true,
    _pendingFile: null,
    _preview: "",
  };
}

function SlideImageUpload({ slide, onFile, lang }) {
  const onDrop = (accepted) => {
    const file = accepted?.[0];
    if (!file) return;
    onFile(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const preview = slide._preview || slide.imageUrl;

  return (
    <div>
      <div className="text-xs font-medium text-gray-600 mb-1">
        {lang === "nl" ? "Achtergrondafbeelding" : "Background image"}
      </div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors min-h-[140px] flex items-center justify-center ${
          isDragActive ? "border-[#ef4d16] bg-orange-50" : "border-gray-200 hover:border-[#ef4d16] hover:bg-orange-50"
        }`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <img src={preview} alt="" className="max-h-32 w-full object-cover rounded-lg" />
        ) : (
          <div className="text-sm text-gray-500 flex flex-col items-center gap-2">
            <ImageIcon className="w-8 h-8 text-gray-400" />
            <span>{lang === "nl" ? "Sleep of klik om te uploaden" : "Drag or click to upload"}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePageSlider({ lang = "nl", embedded = false }) {
  const backendBase = useMemo(() => getBackendBaseUrl(), []);
  const [slides, setSlides] = useState([]);
  const [removedIds, setRemovedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${backendBase}/api/fetch-home-slides`);
      if (res.data?.success && Array.isArray(res.data.slides)) {
        setSlides(
          res.data.slides.map((s, i) => ({
            ...s,
            displayOrder: s.displayOrder ?? i,
            _pendingFile: null,
            _preview: "",
          }))
        );
      } else {
        setSlides([]);
      }
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Failed to load slides");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [backendBase]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateSlide = (idx, patch) => {
    setSlides((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  };

  const addSlide = () => {
    setSlides((prev) => [...prev, emptySlide(prev.length)]);
  };

  const removeSlide = (idx) => {
    const msg =
      lang === "nl"
        ? "Deze slide verwijderen?"
        : "Remove this slide?";
    if (!window.confirm(msg)) return;
    const slide = slides[idx];
    if (slide?._id) {
      setRemovedIds((prev) => [...prev, slide._id]);
    }
    if (slide?._preview) URL.revokeObjectURL(slide._preview);
    setSlides((prev) => prev.filter((_, i) => i !== idx));
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(`${backendBase}/api/upload-image?folder=msbc/slider`, formData, {
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

      const headers = { "Content-Type": "application/json", ...authHeaders() };

      for (const id of removedIds) {
        await axios.delete(`${backendBase}/api/home-slides/${id}`, { headers });
      }

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        if (!slide.text1?.trim() || !slide.text2?.trim()) {
          throw new Error(
            lang === "nl"
              ? `Slide ${i + 1}: vul beide tekstvelden in`
              : `Slide ${i + 1}: fill in both text fields`
          );
        }

        let imageUrl = slide.imageUrl || "";
        let imagePublicId = slide.imagePublicId || "";

        if (slide._pendingFile) {
          const uploaded = await uploadImage(slide._pendingFile);
          imageUrl = uploaded.url;
          imagePublicId = uploaded.publicId;
        }

        const payload = {
          text1: slide.text1.trim(),
          text2: slide.text2.trim(),
          imageUrl,
          imagePublicId,
          displayOrder: i,
          isActive: slide.isActive !== false,
        };

        if (slide._id) {
          await axios.patch(`${backendBase}/api/home-slides/${slide._id}`, payload, { headers });
        } else {
          await axios.post(`${backendBase}/api/home-slides`, payload, { headers });
        }
      }

      setRemovedIds([]);
      setStatus({
        type: "ok",
        text: lang === "nl" ? "Slides opgeslagen in MongoDB" : "Slides saved to MongoDB",
      });
      await load();
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
      <div className={`flex items-center justify-between gap-4 flex-wrap ${embedded ? "" : "items-end"}`}>
        {!embedded && (
          <div>
            <div className="text-xl font-bold">Home Page Slider</div>
            <div className="text-sm text-gray-500">
              {lang === "nl"
                ? "Beheer homepage slides (afbeeldingen via Cloudinary, data in MongoDB)."
                : "Manage homepage slides (images via Cloudinary, data in MongoDB)."}
            </div>
          </div>
        )}
        <div className={`flex flex-wrap items-center gap-2 ${embedded ? "w-full justify-end" : ""}`}>
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

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="bg-white shadow-sm border border-gray-200 rounded-2xl">
              <CardContent className="p-6 h-40 bg-gray-100 rounded-xl" />
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {slides.length === 0 ? (
              <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
                <CardContent className="p-10 text-center text-gray-500">
                  {lang === "nl" ? "Nog geen slides. Voeg er een toe." : "No slides yet. Add one below."}
                </CardContent>
              </Card>
            ) : (
              slides.map((slide, idx) => (
                <Card key={slide._id || `new-${idx}`} className="bg-white shadow-sm border border-gray-200 rounded-2xl">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold text-gray-900">
                        {lang === "nl" ? `Slide ${idx + 1}` : `Slide ${idx + 1}`}
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-[#ef4d16]"
                            checked={slide.isActive !== false}
                            onChange={(e) => updateSlide(idx, { isActive: e.target.checked })}
                          />
                          {lang === "nl" ? "Actief" : "Active"}
                        </label>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => removeSlide(idx)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="block">
                          <span className="block text-xs font-medium text-gray-600 mb-1">Text 1</span>
                          <input
                            className={inputCls}
                            value={slide.text1}
                            onChange={(e) => updateSlide(idx, { text1: e.target.value })}
                            placeholder="1e Stap Is"
                          />
                        </label>
                        <label className="block">
                          <span className="block text-xs font-medium text-gray-600 mb-1">Text 2</span>
                          <input
                            className={inputCls}
                            value={slide.text2}
                            onChange={(e) => updateSlide(idx, { text2: e.target.value })}
                            placeholder="Beginnen"
                          />
                        </label>
                      </div>
                      <SlideImageUpload
                        slide={slide}
                        lang={lang}
                        onFile={(file) => {
                          if (slide._preview) URL.revokeObjectURL(slide._preview);
                          updateSlide(idx, {
                            _pendingFile: file,
                            _preview: URL.createObjectURL(file),
                          });
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <Button variant="outline" className="rounded-xl w-full border-dashed" onClick={addSlide}>
            <Plus className="w-4 h-4 mr-2" />
            {lang === "nl" ? "Slide toevoegen" : "Add slide"}
          </Button>
        </>
      )}
    </div>
  );
}
