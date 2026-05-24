import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Trash2, Star, RefreshCw, Search } from "lucide-react";
import { getBackendBaseUrl } from "../../utils/backend";

const TRAINING_LABELS = {
  "personal-training": "Personal Training",
  "groep-pt": "Groep PT Training",
  "wedstrijd-training": "Wedstrijd Training",
  "afvallen-training": "Afvallen Training",
  "summerbody-1jarig": "Summerbody 1 jarig",
  "summerbody-6-maanden": "Summerbody 6 maanden",
  "summerbody-flex": "Summerbody Flex",
  "bootcamp-training": "Bootcamp Training",
  "pt-ruimte": "PT Ruimte",
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

function trainingLabel(key) {
  if (!key) return "—";
  return TRAINING_LABELS[key] || key;
}

function formatDate(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleString("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StarRow({ rating }) {
  const n = Number(rating) || 0;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i <= n ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="bg-white shadow-sm border border-gray-200 rounded-2xl">
          <CardContent className="p-6 space-y-3">
            <div className="h-5 w-40 rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-100" />
            <div className="h-4 w-3/4 rounded bg-gray-100" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function Reviews({ lang = "nl" }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const backendBase = useMemo(() => getBackendBaseUrl(), []);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${backendBase}/api/fetch-customers-feedback`);
      if (res.data?.success && Array.isArray(res.data.feedbacks)) {
        setReviews(res.data.feedbacks);
      } else {
        setReviews([]);
      }
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [backendBase]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return reviews;
    return reviews.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.testimonial?.toLowerCase().includes(q) ||
        trainingLabel(r.trainingType).toLowerCase().includes(q)
    );
  }, [reviews, search]);

  const featuredCount = useMemo(() => reviews.filter((r) => r.isFeatured).length, [reviews]);

  const handleDelete = async (id) => {
    if (!id || !window.confirm(lang === "nl" ? "Deze review verwijderen?" : "Delete this review?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`${backendBase}/api/customers-feedback/${id}`, { headers: authHeaders() });
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (e) {
      alert(e?.response?.data?.error || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFeatured = async (id, nextValue) => {
    setUpdatingId(id);
    try {
      const res = await axios.patch(
        `${backendBase}/api/customers-feedback/${id}`,
        { isFeatured: nextValue },
        { headers: authHeaders() }
      );
      if (res.data?.feedback) {
        setReviews((prev) =>
          prev.map((r) => (r._id === id ? { ...r, isFeatured: res.data.feedback.isFeatured } : r))
        );
      }
    } catch (e) {
      alert(e?.response?.data?.error || "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-2xl font-bold">Reviews</div>
          <div className="text-sm text-gray-500">
            {lang === "nl"
              ? "Alle klantfeedback en testimonials"
              : "All customer feedback and testimonials"}
          </div>
        </div>
        <Button variant="outline" className="rounded-xl" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          {lang === "nl" ? "Verversen" : "Refresh"}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
          <CardContent className="p-5">
            <div className="text-xs text-gray-500">{lang === "nl" ? "Totaal reviews" : "Total reviews"}</div>
            <div className="text-2xl font-bold mt-1">{reviews.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
          <CardContent className="p-5">
            <div className="text-xs text-gray-500">{lang === "nl" ? "Op homepage" : "On homepage"}</div>
            <div className="text-2xl font-bold mt-1 text-[#ef4d16]">{featuredCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
          <CardContent className="p-5">
            <div className="text-xs text-gray-500">{lang === "nl" ? "Gem. rating" : "Avg. rating"}</div>
            <div className="text-2xl font-bold mt-1">
              {reviews.length
                ? (reviews.reduce((a, r) => a + (Number(r.rating) || 0), 0) / reviews.length).toFixed(1)
                : "—"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "nl" ? "Zoek op naam, training of tekst…" : "Search name, training or text…"}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#ef4d16]"
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <ReviewsSkeleton />
      ) : filtered.length === 0 ? (
        <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
          <CardContent className="p-10 text-center text-gray-500">
            {search
              ? lang === "nl"
                ? "Geen resultaten."
                : "No results."
              : lang === "nl"
                ? "Nog geen reviews."
                : "No reviews yet."}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => (
            <Card key={review._id} className="bg-white shadow-sm border border-gray-200 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-5">
                  {review.imageUrl && (
                    <div className="shrink-0">
                      <img
                        src={review.imageUrl}
                        alt={review.name || "Review"}
                        className="w-24 h-24 rounded-xl object-cover border border-gray-200"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{review.name}</h3>
                        <div className="text-sm text-gray-500 mt-0.5">{trainingLabel(review.trainingType)}</div>
                        <div className="mt-2">
                          <StarRow rating={review.rating} />
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-[#ef4d16]"
                            checked={Boolean(review.isFeatured)}
                            disabled={updatingId === review._id}
                            onChange={(e) => handleToggleFeatured(review._id, e.target.checked)}
                          />
                          {lang === "nl" ? "Homepage" : "Homepage"}
                        </label>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                          disabled={deletingId === review._id}
                          onClick={() => handleDelete(review._id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          {deletingId === review._id ? "…" : lang === "nl" ? "Verwijder" : "Delete"}
                        </Button>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-700 leading-relaxed whitespace-pre-line">{review.testimonial}</p>
                    <div className="mt-3 text-xs text-gray-400">{formatDate(review.createdAt)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
