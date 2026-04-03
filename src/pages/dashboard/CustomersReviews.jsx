import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import SearchHeader from "../../components/dashboard/SearchHeader";
import trashIcon from "../../images/trash.png";
import { getBackendBaseUrl } from "../../utils/backend";
import { useAuth } from "../../context/AuthContext";

const CustomersReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const { token } = useAuth();
    const backendBaseUrl = useMemo(() => getBackendBaseUrl(), []);
    const fetchUrl = `${backendBaseUrl}/api/fetch-customers-feedback`;

    useEffect(() => {
        let isMounted = true;

        const fetchReviews = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(fetchUrl, {
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                });
                if (!isMounted) return;

                if (response.data?.success && Array.isArray(response.data.feedbacks)) {
                    setReviews(response.data.feedbacks);
                } else {
                    setReviews([]);
                    setError("Kon feedback niet laden.");
                }
            } catch (err) {
                if (!isMounted) return;
                console.error("Failed to fetch reviews:", err);
                setError(err.message || "Er is iets misgegaan bij het ophalen.");
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchReviews();

        return () => {
            isMounted = false;
        };
    }, [fetchUrl, token]);

    const handleDelete = async (id) => {
        if (!id) return;
        if (!token) {
            alert("Geen geldige sessie. Log opnieuw in.");
            return;
        }
        const confirmDelete = window.confirm("Weet je zeker dat je deze feedback wilt verwijderen?");
        if (!confirmDelete) return;

        setDeletingId(id);
        try {
                const response = await axios.delete(`${backendBaseUrl}/api/customers-feedback/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            if (response.data?.success) {
                setReviews((prev) => prev.filter((review) => review._id !== id));
            } else {
                alert("Verwijderen is mislukt. Probeer het opnieuw.");
            }
        } catch (err) {
            console.error("Failed to delete feedback:", err);
            alert(err.response?.data?.error || "Verwijderen is mislukt.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleToggleFeatured = async (id, nextValue) => {
        if (!id) return;
        if (!token) {
            alert("Geen geldige sessie. Log opnieuw in.");
            return;
        }

        setUpdatingId(id);
        try {
            const response = await axios.patch(
                `${backendBaseUrl}/api/customers-feedback/${id}`,
                {
                    isFeatured: nextValue,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data?.success && response.data.feedback) {
                setReviews((prev) =>
                    prev.map((review) =>
                        review._id === id ? { ...review, isFeatured: response.data.feedback.isFeatured } : review
                    )
                );
            } else {
                alert("Bijwerken mislukt. Probeer het opnieuw.");
            }
        } catch (err) {
            console.error("Failed to update feedback:", err);
            alert(err.response?.data?.error || "Bijwerken mislukt.");
        } finally {
            setUpdatingId(null);
        }
    };

    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filteredReviews = useMemo(() => {
        if (!normalizedSearch) return reviews;
        return reviews.filter((review) =>
            review.name?.toLowerCase().includes(normalizedSearch)
        );
    }, [reviews, normalizedSearch]);

    const featuredCount = useMemo(
        () => reviews.filter((review) => review.isFeatured).length,
        [reviews]
    );

    return (
        <>
            <SearchHeader
                placeholder="Zoek reviews op naam"
                value={searchTerm}
                onChange={setSearchTerm}
                helperText="Typ een naam om feedback snel te vinden."
            />
            <div className="p-8 w-full animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Customers Reviews</h2>
                    <div className="text-sm text-gray-500 flex flex-col items-end">
                        <span>
                            Totaal: {reviews.length} review{reviews.length === 1 ? "" : "s"}
                        </span>
                        <span>
                            Geselecteerd voor homepage: {featuredCount}
                        </span>
                    </div>
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-16">
                        <div className="relative flex">
                            <span className="animate-ping absolute inline-flex h-20 w-20 rounded-full bg-[#ef4d16]/30"></span>
                            <span className="relative inline-flex items-center justify-center h-20 w-20 rounded-full bg-white border-2 border-[#ef4d16]">
                                <span className="h-12 w-12 border-4 border-[#ef4d16]/60 border-t-transparent rounded-full animate-spin"></span>
                            </span>
                        </div>
                    </div>
                )}
                {error && !loading && (
                    <p className="text-center text-red-500 py-6">Fout: {error}</p>
                )}

                {!loading && !reviews.length && !error && (
                    <p className="text-center text-gray-500 py-10">Geen feedback gevonden.</p>
                )}

                {!loading && reviews.length > 0 && (
                    filteredReviews.length === 0 ? (
                        <p className="text-center text-gray-500 py-10">
                            Geen resultaten voor "{searchTerm}".
                        </p>
                    ) : (
                    <div className="grid gap-6">
                        {filteredReviews.map((review) => (
                            <article
                                key={review._id}
                                className="border border-gray-200 rounded-lg shadow-sm p-6 bg-white hover:shadow-md transition-shadow"
                            >
                                <header className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {review.name}
                                        </h3>
                                        {review.position && (
                                            <p className="text-sm text-gray-500">{review.position}</p>
                                        )}
                                        <div className="mt-2 text-[#ef4d16] text-sm font-medium">
                                            {"⭐".repeat(Number(review.rating) || 0)}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 items-end">
                                        <label className="flex items-center gap-2 text-sm text-gray-600">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 accent-[#ef4d16] cursor-pointer"
                                                checked={Boolean(review.isFeatured)}
                                                disabled={updatingId === review._id}
                                                onChange={(event) =>
                                                    handleToggleFeatured(review._id, event.target.checked)
                                                }
                                            />
                                            Toon op homepage
                                        </label>
                                        <button
                                            onClick={() => handleDelete(review._id)}
                                            disabled={deletingId === review._id}
                                            className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        >
                                            <img src={trashIcon} alt="Delete" className="w-4 h-4" />
                                            {deletingId === review._id ? "Verwijderen..." : "Verwijder"}
                                        </button>
                                    </div>
                                </header>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {review.testimonial}
                                </p>
                                {review.createdAt && (
                                    <footer className="mt-4 text-xs text-gray-400">
                                        Toegevoegd op:{" "}
                                        {new Date(review.createdAt).toLocaleString("nl-NL", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </footer>
                                )}
                            </article>
                        ))}
                    </div>
                    )
                )}
            </div>
        </>
    );
};

export default CustomersReviews;

