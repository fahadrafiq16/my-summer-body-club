import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y } from "swiper/modules";
import { Images, Play } from "lucide-react";
import { getBackendBaseUrl } from "../../utils/backend";
import { slugify } from "./galleryUtils";
import "swiper/css";
import "swiper/css/pagination";
import "./FotosPage.css";

function GalleryCard({ gallery, type, onOpen }) {
  const itemCount = gallery.items?.length || 0;
  const isVideo = type === "videos";

  return (
    <button type="button" className="fotos-gallery-card" onClick={() => onOpen(gallery)}>
      <div className="fotos-gallery-card__image-wrap">
        {gallery.featuredImageUrl ? (
          <img src={gallery.featuredImageUrl} alt={gallery.title} loading="lazy" />
        ) : (
          <div className="fotos-gallery-card__placeholder" />
        )}
        <div className="fotos-gallery-card__overlay">
          <span className="fotos-gallery-card__cta">
            {isVideo ? <Play size={16} /> : <Images size={16} />}
            Bekijk {isVideo ? "video's" : "foto's"}
          </span>
        </div>
        {itemCount > 0 && (
          <span className="fotos-gallery-card__count">
            {itemCount} {isVideo ? "video's" : "foto's"}
          </span>
        )}
      </div>
      <div className="fotos-gallery-card__body">
        <h3 className="fotos-gallery-card__title">{gallery.title}</h3>
      </div>
    </button>
  );
}

function GalleryRow({ title, subtitle, galleries, onOpen, type }) {
  if (!galleries?.length) return null;

  return (
    <section className="fotos-section">
      <div className="fotos-container">
        <div className="section-title fotos-section__heading">
          <h2>
            {title}
            <br />
            <span>{subtitle}</span>
          </h2>
        </div>
      </div>

      <div className="fotos-container fotos-row-slider-wrap">
        <Swiper
          modules={[Pagination, A11y]}
          pagination={{ clickable: true }}
          spaceBetween={20}
          slidesPerView={1.12}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 22 },
            1024: { slidesPerView: 3, spaceBetween: 28 },
          }}
          className="fotos-row-swiper"
        >
          {galleries.map((gallery) => (
            <SwiperSlide key={gallery.id}>
              <GalleryCard gallery={gallery} type={type} onOpen={onOpen} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default function FotosPage() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const base = getBackendBaseUrl();
        const res = await axios.get(`${base}/api/fotos-galleries`);
        if (res.data?.success) {
          setPhotos(res.data.photos || []);
          setVideos(res.data.videos || []);
        }
      } catch (e) {
        setError(e?.response?.data?.error || e?.message || "Galleries laden mislukt");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openGallery = (gallery) => navigate(`/fotos/${slugify(gallery.title)}`);

  return (
    <section className="fotos-page">
      <div className="fotos-page__inner">
        {(loading || error || (!loading && !error && !photos.length && !videos.length)) && (
          <div className="fotos-container">
            {loading && (
              <div className="fotos-page__status">
                <div className="fotos-page__spinner" />
                <p>Galleries laden…</p>
              </div>
            )}
            {error && <p className="fotos-page__error">{error}</p>}
            {!loading && !error && !photos.length && !videos.length && (
              <p className="fotos-page__status">Er zijn nog geen galleries beschikbaar.</p>
            )}
          </div>
        )}

        <GalleryRow
          title="FOTO'S"
          subtitle="TRAINING MOMENTEN"
          galleries={photos}
          onOpen={openGallery}
          type="photos"
        />
        <GalleryRow
          title="VIDEO'S"
          subtitle="IN ACTIE"
          galleries={videos}
          onOpen={openGallery}
          type="videos"
        />
      </div>
    </section>
  );
}
