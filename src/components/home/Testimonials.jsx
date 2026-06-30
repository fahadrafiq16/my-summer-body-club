import { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./Testimonials.css";

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
                            image: feedback.imageUrl?.trim() || avatarPool[index % avatarPool.length],
                            rating: Number.isFinite(rating) ? Math.min(Math.max(rating, 1), 5) : 5,
                            text: feedback.testimonial?.trim() || "",
                        };
                    }).filter((item) => item.text.length > 0);

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
        <section className="home-testimonials-section">
            <div className="home-testimonials-inner">
                <div className="section-title-testimonial">
                    <h2>
                        RECENCIES EN FEEDBACK <span>VAN ONZE LEDEN</span>
                    </h2>
                </div>

                {hasError && (
                    <p className="home-testimonials-notice">
                        We tonen momenteel voorbeeldreviews. Selecteer testimonials in het dashboard om ze hier te tonen.
                    </p>
                )}

                {isLoading ? (
                    <div className="home-testimonials-loading">Bezig met laden...</div>
                ) : (
                    <Swiper
                        className="home-testimonials-swiper"
                        slidesPerView={1}
                        spaceBetween={24}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5500, disableOnInteraction: false }}
                        modules={[Pagination, Autoplay]}
                        loop={testimonials.length > 3}
                    >
                        {testimonials.map((testimonial, index) => (
                            <SwiperSlide key={`${testimonial.name}-${index}`} className="h-auto">
                                <TestimonialCard testimonial={testimonial} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
        </section>
    );
}

function TestimonialCard({ testimonial }) {
    const [expanded, setExpanded] = useState(false);
    const MAX_LENGTH = 160;

    const displayText =
        expanded || testimonial.text.length <= MAX_LENGTH
            ? testimonial.text
            : `${testimonial.text.substring(0, MAX_LENGTH)}…`;

    const rating = Number(testimonial.rating) || 0;

    return (
        <article className="testimonial-card">
            <div className="testimonial-card__accent" aria-hidden="true" />
            <span className="testimonial-card__quote" aria-hidden="true">&ldquo;</span>

            <div className="testimonial-card__body">
                <div className="testimonial-card__stars" aria-label={`${rating} van 5 sterren`}>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <span
                            key={index}
                            className={index < rating ? "testimonial-card__star is-filled" : "testimonial-card__star"}
                        >
                            ★
                        </span>
                    ))}
                </div>

                <p className="testimonial-card__text">{displayText}</p>

                {testimonial.text.length > MAX_LENGTH && (
                    <button
                        className="testimonial-card__read-more"
                        onClick={() => setExpanded(!expanded)}
                        type="button"
                    >
                        {expanded ? "Lees minder" : "Lees meer"}
                    </button>
                )}
            </div>

            <footer className="testimonial-card__footer">
                <div className="testimonial-card__avatar-wrap">
                    <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="testimonial-card__avatar"
                    />
                </div>
                <div className="testimonial-card__meta">
                    <h4 className="testimonial-card__name">{testimonial.name}</h4>
                    {testimonial.role && (
                        <span className="testimonial-card__role">{testimonial.role}</span>
                    )}
                </div>
            </footer>
        </article>
    );
}
