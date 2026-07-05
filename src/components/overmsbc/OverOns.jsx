import React, { useEffect, useMemo, useRef, useState } from 'react'
import MarlonImg from '../../images/1000038289.jpg'
import VideoModal from '../home/VideoModal'
import { useNavigate } from "react-router-dom";
import { getBackendBaseUrl } from '../../utils/backend';
import './OverOns.css';

const SECTION_KEY = 'over-msbc';

function OverMsbcImageCarousel({ images }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const pointerStartX = useRef(null);
    const isDraggingRef = useRef(false);
    const count = images.length;
    const canSlide = count > 1;
    const SWIPE_THRESHOLD = 50;

    useEffect(() => {
        setActiveIndex(0);
        setDragOffset(0);
    }, [images]);

    useEffect(() => {
        if (!canSlide || isDragging) return undefined;

        const timer = window.setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % count);
        }, 5000);

        return () => window.clearInterval(timer);
    }, [canSlide, count, isDragging]);

    const goTo = (index) => {
        if (!canSlide) return;
        setActiveIndex((index + count) % count);
    };

    const finishDrag = (clientX) => {
        if (!isDraggingRef.current || pointerStartX.current === null) return;

        const delta = clientX - pointerStartX.current;
        pointerStartX.current = null;
        isDraggingRef.current = false;
        setIsDragging(false);
        setDragOffset(0);

        if (Math.abs(delta) < SWIPE_THRESHOLD) return;
        setActiveIndex((prev) =>
            delta > 0 ? (prev - 1 + count) % count : (prev + 1) % count
        );
    };

    const handlePointerDown = (event) => {
        if (!canSlide || event.button !== 0) return;
        pointerStartX.current = event.clientX;
        isDraggingRef.current = true;
        setIsDragging(true);
        setDragOffset(0);
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event) => {
        if (!isDraggingRef.current || pointerStartX.current === null) return;
        setDragOffset(event.clientX - pointerStartX.current);
    };

    const handlePointerUp = (event) => {
        finishDrag(event.clientX);
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    };

    const handlePointerCancel = (event) => {
        finishDrag(event.clientX);
    };

    const trackStyle = {
        transform: `translateX(calc(-${activeIndex * 100}% + ${dragOffset}px))`,
        transition: isDragging ? 'none' : undefined,
    };

    return (
        <div className="over-ons-carousel">
            <div
                className={`over-ons-carousel__viewport${canSlide ? ' over-ons-carousel__viewport--draggable' : ''}${isDragging ? ' is-grabbing' : ''}`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
                onPointerLeave={(event) => {
                    if (isDraggingRef.current) finishDrag(event.clientX);
                }}
            >
                <div
                    className={`over-ons-carousel__track${isDragging ? ' is-dragging' : ''}`}
                    style={trackStyle}
                >
                    {images.map((src, index) => (
                        <div className="over-ons-carousel__slide" key={`${index}-${src}`}>
                            <img src={src} alt={`Over MSBC ${index + 1}`} draggable={false} />
                        </div>
                    ))}
                </div>

                {canSlide && (
                    <>
                        <button
                            type="button"
                            className="over-ons-carousel__nav over-ons-carousel__nav--prev"
                            onClick={() => goTo(activeIndex - 1)}
                            onPointerDown={(event) => event.stopPropagation()}
                            aria-label="Vorige afbeelding"
                        >
                            ‹
                        </button>
                        <button
                            type="button"
                            className="over-ons-carousel__nav over-ons-carousel__nav--next"
                            onClick={() => goTo(activeIndex + 1)}
                            onPointerDown={(event) => event.stopPropagation()}
                            aria-label="Volgende afbeelding"
                        >
                            ›
                        </button>
                    </>
                )}
            </div>

            {canSlide && (
                <div className="over-ons-carousel__dots">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            className={`over-ons-carousel__dot${index === activeIndex ? ' is-active' : ''}`}
                            onClick={() => setActiveIndex(index)}
                            aria-label={`Afbeelding ${index + 1}`}
                            aria-current={index === activeIndex}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

const OverOns = () => {
    const navigate = useNavigate();
    const [slideImages, setSlideImages] = useState(null);

    const apiUrl = useMemo(
        () => `${getBackendBaseUrl()}/api/fetch-home-section/${SECTION_KEY}`,
        []
    );

    useEffect(() => {
        let isMounted = true;

        const fetchImages = async () => {
            try {
                const res = await fetch(apiUrl);
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                if (!isMounted) return;

                if (data?.success && data.section) {
                    const urls = (data.section.galleryItems || [])
                        .filter((item) => item?.imageUrl)
                        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                        .map((item) => item.imageUrl);
                    setSlideImages(urls);
                    return;
                }
                setSlideImages([]);
            } catch {
                if (isMounted) setSlideImages([]);
            }
        };

        fetchImages();
        return () => {
            isMounted = false;
        };
    }, [apiUrl]);

    const imagesToShow = slideImages && slideImages.length > 0 ? slideImages : [MarlonImg];

    return (
        <>
            <div id="msbc_ben_je" className="padding-all">
                <div className="container">
                    <div className="msbc_ben_je_content_area">
                        <div className="msbc_ben_je_left">
                            <h3>
                                Ben Je Er Klaar <span className="msbc_span">Voor?</span>
                            </h3>
                            <p className="msbc_normal_p font-bold">
                                Is je motivatie vervlogen en lijkt jouw doel verder weg dan ooit?
                            </p>
                            <p>
                                Dan is het tijd voor verandering.{' '}
                                <br className="hidden md:inline" />
                                Kies een van onze diensten en ontdek wat écht trainen betekent.
                            </p>
                            <p className="mt-4">
                                Bij My Summerbody Club train je met personal trainer Marlon —{' '}
                                <br className="hidden md:inline" />
                                meer dan 30 jaar praktijkervaring en bewezen succes als wedstrijdtrainer en coach.
                            </p>
                            <p className="mt-4">
                                Marlon ziet wat anderen missen.
                                <br className="hidden md:inline" />{' '}
                                Hij heeft oog voor detail en tilt jouw training naar het hoogste niveau.
                                <br className="hidden md:inline" />{' '}
                                Je leert opnieuw trainen — anders dan je gewend bent —
                                <br className="hidden md:inline" />{' '}
                                en ontdekt spiergroepen waarvan je niet wist dat je ze had.
                            </p>

                            <div style={{ marginTop: '30px' }} className="form-border"></div>

                            <h3 className="mt-4">Voor wie?</h3>

                            <p className="mt-4">
                                Wij begeleiden mannen en vrouwen die:
                            </p>

                            <ul className="styled-list-icons mt-2 mb-2">
                                <li>100% inzet tonen</li>
                                <li>hun grenzen willen verleggen</li>
                                <li>durven los te laten en willen groeien</li>
                            </ul>

                            <p>
                                Verwacht geen standaardschema's of snelle oplossingen.
                            </p>
                            <p>
                                Wij bieden persoonlijke coaching voor duurzame, zichtbare resultaten —{' '}
                                <br className="hidden md:inline" />
                                met focus op <strong>mindset, techniek, houding, spieractivatie, doorzettingsvermogen en structuur.</strong>
                            </p>

                            <blockquote className="italic border-l-4 [border-color:#EF4D16] pl-4 text-[#000000] mx-auto mt-8 text-sm sm:text-base">
                                "No rush, because nobody waits for you and nobody loves you.
                                <br className="hidden md:inline" />{' '}
                                I don't train construction workers, but sculptors.
                                <br className="hidden md:inline" />{' '}
                                To become a masterpiece, you must edit yourself."
                                <span className="block mt-2 text-center font-semibold not-italic">— Marlon</span>
                            </blockquote>

                            <div style={{ marginTop: '30px' }} className="form-border"></div>

                            <h3 className="mt-4">Of je nu:</h3>

                            <ul className="styled-list-icons mt-4 mb-2">
                                <li>fitter wilt worden,</li>
                                <li>je lichaam wilt shapen,</li>
                                <li>deelnemen of je voorbereidt op een bodybuildingwedstrijd —</li>
                            </ul>

                            <p className="mt-4">
                                <strong>Marlon helpt je het maximale uit jezelf te halen.</strong>
                            </p>

                            <p className="mt-4">
                                Bij ons train je niet alleen…
                            </p>
                            <p>
                                <strong>je hoort erbij.</strong>
                            </p>

                            <p className="mt-4">Ben jij klaar om beeldhouwer te worden van jouw Summerbody — voor het hele jaar?</p>

                            <div className="msbc-contact-detail">
                                <div className="msbc-left-detail">
                                    <button
                                        className="button-focused-proefles msbc_ben_button"
                                        onClick={() => navigate("/proefles")}
                                    >
                                        START JE NIEUWE LIFE STYLE VANDAAG!
                                    </button>

                                    <button
                                        className="msbc_ben_button"
                                        onClick={() => navigate("/contact")}
                                    >
                                        Neem contact op
                                    </button>

                                    <div className="msbc_ben_social-profiles">
                                        <a className="msbc_ben_item" href="#">
                                            <i className="fab fa-instagram"></i>
                                        </a>
                                        <a className="msbc_ben_item" href="#">
                                            <i className="fab fa-pinterest"></i>
                                        </a>
                                        <a className="msbc_ben_item" href="#">
                                            <i className="fab fa-youtube"></i>
                                        </a>
                                    </div>
                                </div>

                                <div className="email-area">
                                    <img
                                        src="https://mysummerbodyclub.nl/wp-content/themes/my-summer-body-club/assets/img-2.png"
                                        alt="Mobile"
                                    />
                                    <div className="header-content">
                                        <h3>Mobile Nummer</h3>
                                        <p>(+31) 6 27 28 28 56</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="msbc_ben_je_right">
                            {slideImages === null ? (
                                <div className="over-ons-carousel over-ons-carousel--loading">
                                    <img src={MarlonImg} alt="Over MSBC" />
                                </div>
                            ) : (
                                <OverMsbcImageCarousel images={imagesToShow} />
                            )}
                            <div className="popup-btn mt-10 md:mt-[120px] flex justify-center">
                                <div id="video-button" className="video-button">
                                    <VideoModal showAnimation />
                                    <div id="vidBox"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OverOns
