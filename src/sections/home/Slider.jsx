// import Swiper core and required modules
import { useEffect, useMemo, useState } from "react";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay, EffectFade } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import "swiper/css/effect-fade";

import slide1 from '../../images/slide-1.jpeg';
import slide2 from '../../images/slide-2.webp';
import slide3 from '../../images/slide-3.webp';
import { getBackendBaseUrl } from '../../utils/backend';

const FALLBACK_SLIDES = [
  {
    image: slide1,
    text1: "1e Stap Is",
    text2: "Beginnen",
  },
  {
    image: slide2,
    text1: "2e Stap Is",
    text2: "Voeding",
  },
  {
    image: slide3,
    text1: "3e Stap Is",
    text2: "Vertrouwen",
  },
];

export default function Slider() {
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [isLoading, setIsLoading] = useState(true);

  const apiEndpoint = useMemo(() => {
    const override = process.env.REACT_APP_HOME_SLIDER_ENDPOINT?.trim();
    if (override) return override;
    return `${getBackendBaseUrl()}/api/fetch-home-slides`;
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchSlides = async () => {
      try {
        const url = new URL(apiEndpoint);
        url.searchParams.set("active", "true");

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("Failed to fetch slides");

        const data = await response.json();
        const apiSlides = Array.isArray(data?.slides) ? data.slides : [];

        if (!isMounted) return;

        if (apiSlides.length > 0) {
          setSlides(
            apiSlides.map((slide) => ({
              image: slide.imageUrl,
              text1: slide.text1,
              text2: slide.text2,
            }))
          );
        } else {
          setSlides(FALLBACK_SLIDES);
        }
      } catch {
        if (isMounted) setSlides(FALLBACK_SLIDES);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchSlides();
    return () => {
      isMounted = false;
    };
  }, [apiEndpoint]);

  if (isLoading) {
    return (
      <div
        className="custom-swiper-slide-class bg-gray-200 animate-pulse"
        style={{ width: "100%", height: "87vh" }}
      />
    );
  }

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay, EffectFade]}
      spaceBetween={30}
      slidesPerView={1}
      navigation
      effect="fade"
      fadeEffect={{ crossFade: true }}
      style={{ width: "100%", height: "87vh" }}
      className="custom-swiper-slide-class"
    >
      {slides.map((slide, index) => (
        <SwiperSlide
          key={index}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100vh",
          }}
          className="custom-swiper-slide-class"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "83%",
              margin: "0 auto",
              height: "100%",
              textAlign: "center",
              color: "#fff",
            }}
          >
            <h2 style={{ fontSize: "80px", fontWeight: 700 }}>{slide.text1}</h2>
            <p style={{ fontSize: "80px", fontWeight: 700, color: '#f04d17' }}>{slide.text2}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
