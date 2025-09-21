import React from 'react'
import TitleHeader from '../../components/common/TitleHeader'
import BootcampImg from '../../images/bootcamp-2025.png'
import TextField from '../../components/common/TextField';
import axios from "axios"
import { useForm } from 'react-hook-form';

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const BASE_BACKEND_URL = process.env.REACT_APP_BASE_BACKEND_URL;

const containerStyle = {
    width: "100%",
    height: "400px",
};

// Coordinates for Almere, Netherlands
const center = {
    lat: 52.3507849,
    lng: 5.2647016,
};

// Custom Map Style (Dark Theme Example)
const mapStyles = [
    {
        elementType: "geometry",
        stylers: [{ color: "#212121" }],
    },
    {
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
    },
    {
        elementType: "labels.text.fill",
        stylers: [{ color: "#757575" }],
    },
    {
        elementType: "labels.text.stroke",
        stylers: [{ color: "#212121" }],
    },
    {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [{ color: "#757575" }],
    },
    {
        featureType: "poi",
        elementType: "geometry",
        stylers: [{ color: "#181818" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#383838" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212121" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#000000" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#3d3d3d" }],
    },
];

const ContactForm = () => {

    const { register, handleSubmit, control, formState: { errors } } = useForm({});
    const [loading, setLoading] = React.useState(false);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            console.log("Form Data:", data);

            const res = await axios.post(
                `${BASE_BACKEND_URL}/api/contact-email`,
                { data } // ✅ backend expects { data }
            );

            if (res.data.success) {
                alert("✅ " + res.data.message);
            } else {
                alert("❌ " + res.data.message);
            }
        } catch (err) {
            console.error("Request Error:", err);
            alert("⚠️ Server error, email not sent");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TitleHeader title={'Contact'} />
            <div className="container max-w-[1110px]">
                <div className="py-16">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="">

                            <h3 class="contact form-h3">LAAT EEN BERICHT ACHTER</h3>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <TextField
                                    label="Naam:"
                                    name="naam"
                                    register={register}
                                    validation={{ required: 'Naam is required' }}
                                    errors={errors}
                                    placeholder=""
                                />

                                <TextField
                                    label="Email:"
                                    name="email"
                                    register={register}
                                    validation={{
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                            message: 'Invalid email address',
                                        },
                                    }}
                                    errors={errors}
                                    placeholder=""
                                />

                                <TextField
                                    label="Onderwep:"
                                    name="onderwep"
                                    register={register}
                                    validation={{ required: 'Onderwep is required' }}
                                    errors={errors}
                                    placeholder=""
                                />

                                <div>
                                    <label className="block  mt-4 font-bold">Message:</label>
                                    <textarea
                                        {...register("message", { required: "Message is required" })}
                                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                                        rows="4"
                                        placeholder="Type your message..."
                                    />
                                    {errors.message && (
                                        <p className="text-red-500 text-sm">{errors.message.message}</p>
                                    )}
                                </div>

                                <TextField
                                    label="Hoe heeft u ons gevonden?:"
                                    name="hoeheeft"
                                    register={register}
                                    validation={{}}
                                    errors={errors}
                                    placeholder=""
                                />

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-[#F04D17] w-full text-white px-4 py-2 mt-4 flex-1 disabled:opacity-50"
                                >
                                    {loading ? "Versturen..." : "Bericht verzenden"}
                                </button>
                            </form>
                        </div>
                        <div className="p-4">

                            <iframe
                                title="Google Maps - Almere"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9734.297270928386!2d5.2534!3d52.3508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c617184e0f2d1d%3A0x400de5a8e61b4f0!2sAlmere%2C%20Netherlands!5e0!3m2!1sen!2snl!4v1694429052753!5m2!1sen!2snl"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />

                    </div>
                </div>
            </div>
        </div >

        </>
    )
}

export default ContactForm
