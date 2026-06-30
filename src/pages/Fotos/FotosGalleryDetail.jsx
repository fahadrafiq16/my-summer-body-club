import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import TitleHeader from "../../components/common/TitleHeader";
import { getBackendBaseUrl } from "../../utils/backend";
import { slugify } from "./galleryUtils";
import "swiper/css";
import "./FotosPage.css";

export default function FotosGalleryDetail() {
  const { slug } = useParams();
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [active, setActive] = useState(0);

  const swiperRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const base = getBackendBaseUrl();
        const res = await axios.get(`${base}/api/fotos-galleries`);
        if (res.data?.success) {
          const all = [...(res.data.photos || []), ...(res.data.videos || [])];
          const found = all.find((g) => slugify(g.title) === slug) || all.find((g) => g.id === slug);
          setGallery(found || null);
          if (!found) setError("Gallery niet gevonden.");
        }
      } catch (e) {
        setError(e?.response?.data?.error || e?.message || "Gallery laden mislukt");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const items = gallery?.items || [];
  const isVideo = gallery?.galleryType === "videos";

  return (
    <>
      <TitleHeader title={gallery?.title || "Gallery"} />
      <section className="fotos-page">
        <div className="fotos-container fotos-page__inner">
          <Link to="/fotos" className="fotos-detail__back">
            <ArrowLeft size={18} />
            Terug naar gallery
          </Link>

          {loading && (
            <div className="fotos-page__status">
              <div className="fotos-page__spinner" />
              <p>Gallery laden…</p>
            </div>
          )}

          {!loading && error && <p className="fotos-page__error">{error}</p>}

          {!loading && gallery && (
            <div className="fotos-detail fotos-detail--page">
              <div className="fotos-detail__header">
                <div>
                  <p className="fotos-detail__label">{isVideo ? "Video gallery" : "Foto gallery"}</p>
                  <h3 className="fotos-detail__title">{gallery.title}</h3>
                </div>
                {items.length > 0 && (
                  <div className="fotos-detail__header-right">
                    <span className="fotos-detail__counter">
                      {active + 1} / {items.length}
                    </span>
                  </div>
                )}
              </div>

              {items.length === 0 ? (
                <p className="fotos-detail__empty">Er zijn nog geen items in deze gallery.</p>
              ) : (
                <div className="fotos-detail__stage">
                  <button
                    type="button"
                    onClick={() => swiperRef.current?.slidePrev()}
                    disabled={active === 0}
                    className="fotos-detail__nav fotos-detail__nav--prev"
                    aria-label="Vorige"
                  >
                    <ChevronLeft size={26} />
                  </button>

                  <div className="fotos-detail__viewport">
                    <Swiper
                      modules={[A11y]}
                      onSwiper={(s) => {
                        swiperRef.current = s;
                      }}
                      onSlideChange={(s) => setActive(s.activeIndex)}
                      slidesPerView={1}
                      spaceBetween={0}
                      className="fotos-detail__swiper"
                    >
                      {items.map((item, index) => (
                        <SwiperSlide key={`${item.mediaUrl}-${index}`}>
                          <div className="fotos-detail__media-wrap">
                            {item.mediaType === "video" ? (
                              <video src={item.mediaUrl} controls playsInline className="fotos-detail__media" />
                            ) : (
                              <img src={item.mediaUrl} alt="" className="fotos-detail__media" loading="lazy" />
                            )}
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>

                  <button
                    type="button"
                    onClick={() => swiperRef.current?.slideNext()}
                    disabled={active >= items.length - 1}
                    className="fotos-detail__nav fotos-detail__nav--next"
                    aria-label="Volgende"
                  >
                    <ChevronRight size={26} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
