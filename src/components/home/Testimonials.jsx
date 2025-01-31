import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
    {
        name: "John Doe",
        role: "Manager",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
        rating: 5,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu rhoncus urna facilisis quisque orci lectus sed nulla. Proin fermentum consectetur arcu, nec aliquet lorem. Donec eget sem nec sapien dignissim tincidunt.",
    },
    {
        name: "Jane Smith",
        role: "Designer",
        image: "https://randomuser.me/api/portraits/women/2.jpg",
        rating: 4,
        text: "Amazing experience! The service was excellent and exceeded my expectations. Their attention to detail and customer support were truly outstanding. I will definitely use their service again in the future.",
    },
    {
        name: "Alex Johnson",
        role: "Developer",
        image: "https://randomuser.me/api/portraits/men/3.jpg",
        rating: 5,
        text: "Highly recommend! The team was professional and the quality was outstanding. I was very impressed with their level of dedication and the way they handled my project from start to finish.",
    },
    {
        name: "Emily Davis",
        role: "Marketing Lead",
        image: "https://randomuser.me/api/portraits/women/4.jpg",
        rating: 5,
        text: "The best service I have ever used. Great attention to detail and fantastic support! I couldn't have asked for a better experience. The entire process was seamless and stress-free.",
    },
];

export default function Testimonials() {
    return (
        <>
            <div className="section-title-testimonial">
                <h2>RECENCIES EN FEEDBACK VAN ONZE LEDEN HIER TE LEZEN</h2>
            </div>
            <div className="max-w-6xl mx-auto p-2">
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
                    loop
                >
                    {testimonials.map((testimonial, index) => (
                        <SwiperSlide key={index}>
                            <TestimonialCard testimonial={testimonial} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </>
    );
}

function TestimonialCard({ testimonial }) {
    const [expanded, setExpanded] = useState(false);
    const MAX_LENGTH = 140; // Characters before truncation

    return (
        <div className="p-5 bg-white shadow-lg rounded-lg border">
            <div className="flex items-center space-x-4">
                <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full" />
                <div>
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
            </div>
            <div className="mt-3 flex">
                {"⭐".repeat(testimonial.rating)}
            </div>
            <p className="mt-2 text-[#414141]">
                {expanded ? testimonial.text : `${testimonial.text.substring(0, MAX_LENGTH)}...`}
            </p>
            <button
                className="text-gray-600 text-sm mt-2"
                onClick={() => setExpanded(!expanded)}
            >
                {expanded ? "Show less" : "Read more"}
            </button>
        </div>
    );
}
