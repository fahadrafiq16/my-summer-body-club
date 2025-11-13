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
    const [submitStatus, setSubmitStatus] = React.useState({ type: null, message: "" });

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setSubmitStatus({ type: null, message: "" });
            console.log("Form Data:", data);

            const res = await axios.post(
                `${BASE_BACKEND_URL}/api/contact-email`,
                { data } // ✅ backend expects { data }
            );

            if (res.data.success) {
                setSubmitStatus({ type: "success", message: res.data.message || "Bericht succesvol verzonden." });
            } else {
                setSubmitStatus({ type: "error", message: res.data.message || "Verzenden mislukt." });
            }
        } catch (err) {
            console.error("Request Error:", err);
            setSubmitStatus({ type: "error", message: "Serverfout, e-mail niet verzonden." });
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
                                        placeholder="Type je bericht......."
                                    />
                                    {errors.message && (
                                        <p className="text-red-500 text-sm">{errors.message.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block  mt-4 font-bold">Hoe heeft u ons gevonden?</label>
                                    <select
                                        {...register("hoeheeft")}
                                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Selecteer een optie</option>
                                        <option value="Internet">Internet</option>
                                        <option value="Google">Google</option>
                                        <option value="Instagram">Instagram</option>
                                        <option value="Tiktok">Tiktok</option>  
                                        <option value="Facebook">Facebook</option>
                                        <option value="Linkedin">Linkedin</option>   
                                        <option value="Vrienden">Vrienden</option>   
                                        <option value="Sportsschool">Sportsschool</option>    
                                                  
                                        
                                   
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 text-white transition
                                    ${loading ? 'bg-[#F04D17]/80' : 'bg-[#F04D17] hover:opacity-90'} disabled:opacity-50`}
                                >
                                    {loading && (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                        </svg>
                                    )}
                                    {loading ? "Versturen..." : "Bericht verzenden"}
                                </button>

                                {submitStatus.type && (
                                    <div
                                        className={`mt-3 rounded-md border px-4 py-3 text-sm transition-all duration-300
                                        ${submitStatus.type === 'success'
                                            ? 'bg-green-50 border-green-200 text-green-800'
                                            : 'bg-red-50 border-red-200 text-red-800'}`}
                                        role="alert"
                                    >
                                        <div className="flex items-center gap-2">
                                            {submitStatus.type === 'success' ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.536-10.95a1 1 0 00-1.414-1.414L10 7.757 7.879 5.636A1 1 0 106.464 7.05L8.586 9.172l-2.122 2.121a1 1 0 101.415 1.415L10 10.586l2.121 2.122a1 1 0 001.415-1.415L11.414 9.172l2.122-2.121z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            <span>{submitStatus.message}</span>
                                        </div>
                                    </div>
                                )}
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
