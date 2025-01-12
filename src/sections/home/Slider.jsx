// import Swiper core and required modules
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

const slides = [
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

export default () => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay, EffectFade]}
      spaceBetween={30}
      slidesPerView={1}
      navigation
      //pagination={{ clickable: true }}
      //autoplay={{ delay: 5000 }}
      effect="fade" // Use the fade effect for smooth transitions
      fadeEffect={{ crossFade: true }} // Ensure smooth crossfade
      style={{ width: "100%", height: "87vh" }}
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
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "1030px",
              margin: "0 auto",
              height: "100%",
              textAlign: "center",
              color: "#fff",
            }}
          >
            <h2 style={{ fontSize: "80px", fontWeight:700, }}>{slide.text1}</h2>
            <p style={{ fontSize: "80px", fontWeight:700, color:'#f04d17', }}>{slide.text2}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
