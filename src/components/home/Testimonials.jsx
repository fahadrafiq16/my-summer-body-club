import { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const FALLBACK_TESTIMONIALS = [
    {
        name: "MSBC Member",
        role: "Lid",
        image: "https://i.pravatar.cc/160?img=11",
        rating: 5,
        text: "Sinds ik bij My Summerbody Club train, voel ik me energieker dan ooit. De trainers motiveren me om elke sessie het maximale te geven.",
    },
    {
        name: "Summerbody Trainee",
        role: "Lid",
        image: "https://i.pravatar.cc/160?img=12",
        rating: 4,
        text: "De persoonlijke aanpak en de duidelijke structuur maken het verschil. Ik zie nu al resultaat en blijf gemotiveerd.",
    },
    {
        name: "Dedicated Athlete",
        role: "Lid",
        image: "https://i.pravatar.cc/160?img=13",
        rating: 5,
        text: "Top begeleiding! De coaches staan altijd klaar en de trainingen zijn uitdagend maar haalbaar.",
    },
];

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const avatarPool = useMemo(
        () => [
            "https://i.pravatar.cc/160?img=15",
            "https://i.pravatar.cc/160?img=16",
            "https://i.pravatar.cc/160?img=17",
            "https://i.pravatar.cc/160?img=18",
            "https://i.pravatar.cc/160?img=19",
            "https://i.pravatar.cc/160?img=20",
            "https://i.pravatar.cc/160?img=21",
            "https://i.pravatar.cc/160?img=22",
        ],
        []
    );

    const API_ENDPOINT = useMemo(() => {
        const override = process.env.REACT_APP_FEEDBACK_ENDPOINT?.trim();
        if (override) return override;

        const isBrowser = typeof window !== "undefined";
        const isLocal = isBrowser && window.location.hostname === "localhost";

        return isLocal
            ? "http://localhost:5000/api/fetch-customers-feedback"
            : "https://msbc-backend.vercel.app/api/fetch-customers-feedback";
    }, []);

    const FEATURED_LIMIT = useMemo(() => {
        const rawLimit = process.env.REACT_APP_FEEDBACK_LIMIT;
        const parsed = rawLimit ? parseInt(rawLimit, 10) : NaN;
        return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
    }, []);

    useEffect(() => {
        let isMounted = true;

        const fetchTestimonials = async () => {
            try {
                const endpointUrl = new URL(API_ENDPOINT);
                endpointUrl.searchParams.set("featured", "true");
                if (FEATURED_LIMIT) {
                    endpointUrl.searchParams.set("limit", String(FEATURED_LIMIT));
                }

                const response = await fetch(endpointUrl.toString());
                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }

                const data = await response.json();

                if (data?.success && Array.isArray(data.feedbacks)) {
                    const filtered = data.feedbacks.filter((feedback) => feedback?.isFeatured);
                    const source = filtered.length ? filtered : data.feedbacks;

                    const normalized = source.map((feedback, index) => {
                        const rating = Number(feedback.rating);
                        return {
                            name: feedback.name?.trim() || "MSBC Member",
                            role: feedback.position?.trim() || "Lid",
                            image: avatarPool[index % avatarPool.length],
                            rating: Number.isFinite(rating) ? Math.min(Math.max(rating, 1), 5) : 5,
                            text: feedback.testimonial?.trim() || "",
                        };
                    }).filter(item => item.text.length > 0);

                    if (isMounted && normalized.length) {
                        setTestimonials(normalized);
                        setHasError(false);
                        return;
                    }
                }

                if (isMounted) {
                    setTestimonials(FALLBACK_TESTIMONIALS);
                    setHasError(true);
                }
            } catch (error) {
                console.error("Failed to fetch testimonials:", error);
                if (isMounted) {
                    setTestimonials(FALLBACK_TESTIMONIALS);
                    setHasError(true);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchTestimonials();

        return () => {
            isMounted = false;
        };
    }, [API_ENDPOINT, FEATURED_LIMIT, avatarPool]);

    return (
        <>
            <div className="section-title-testimonial">
                <h2>RECENCIES EN FEEDBACK VAN ONZE LEDEN HIER TE LEZEN</h2>
            </div>
            {hasError && (
                <p className="text-center text-sm text-gray-500 mb-4">
                    We tonen momenteel voorbeeldreviews. Selecteer testimonials in het dashboard om ze hier te tonen.
                </p>
            )}
            <div className="max-w-6xl mx-auto p-2">
                {isLoading ? (
                    <div className="py-12 text-center text-gray-500">Bezig met laden...</div>
                ) : (
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={20}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000 }}
                        modules={[Pagination, Autoplay]}
                        loop={testimonials.length > 1}
                    >
                        {testimonials.map((testimonial, index) => (
                            <SwiperSlide key={`${testimonial.name}-${index}`}>
                                <TestimonialCard testimonial={testimonial} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
        </>
    );
}

function TestimonialCard({ testimonial }) {
    const [expanded, setExpanded] = useState(false);
    const MAX_LENGTH = 140; // Characters before truncation

    const displayText =
        expanded || testimonial.text.length <= MAX_LENGTH
            ? testimonial.text
            : `${testimonial.text.substring(0, MAX_LENGTH)}…`;

    const renderStars = () => {
        const rating = Number(testimonial.rating) || 0;
        return Array.from({ length: 5 }).map((_, index) => (
            <span
                key={index}
                className={`text-lg ${index < rating ? "text-[#ef4d16]" : "text-gray-300"}`}
            >
                ★
            </span>
        ));
    };

    return (
        <div className="relative h-full rounded-2xl border border-white/60 bg-white/90 shadow-[0_25px_45px_-20px_rgba(15,23,42,0.18)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_30px_55px_-24px_rgba(15,23,42,0.26)]">
            <div className="flex h-full flex-col justify-between px-6 py-6">
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[#ef4d16] to-[#ff9368] p-[2px]">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="h-12 w-12 rounded-full border-4 border-white object-cover shadow-sm"
                                />
                            </span>
                            <div>
                                <h4 className="text-lg font-semibold text-slate-900">{testimonial.name}</h4>
                                {testimonial.role && (
                                    <p className="text-sm uppercase tracking-wide text-slate-500">
                                        {testimonial.role}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-0.5">{renderStars()}</div>
                    </div>
                    <p className="text-[15px] leading-relaxed text-slate-600">{displayText}</p>
                </div>

                {testimonial.text.length > MAX_LENGTH && (
                    <button
                        className="mt-4 inline-flex items-center text-sm font-medium text-[#ef4d16] transition hover:text-[#c7390a]"
                        onClick={() => setExpanded(!expanded)}
                        type="button"
                    >
                        {expanded ? "Lees minder" : "Lees meer"}
                    </button>
                )}
            </div>
        </div>
    );
}
