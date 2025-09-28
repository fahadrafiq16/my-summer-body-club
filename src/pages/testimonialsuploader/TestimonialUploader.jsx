import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const BASE_BACKEND_URL = process.env.REACT_APP_BASE_BACKEND_URL;

const TestimonialForm = () => {
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await axios.post(
                `${BASE_BACKEND_URL}/api/testimonials`,
                data, // ✅ send plain JSON
                { headers: { "Content-Type": "application/json" } }
            );

            if (res.data.success) {
                alert("✅ Testimonial submitted!");
                reset();
            }
        } catch (error) {
            console.error("Error submitting testimonial:", error);
            alert("❌ Failed to submit testimonial");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md mx-auto p-6 m-12 border rounded-lg shadow space-y-4"
        >
            <h2 className="text-xl font-bold">Submit Your Testimonial</h2>

            <div>
                <label className="block font-semibold">Name</label>
                <input
                    type="text"
                    {...register("name", { required: true })}
                    className="w-full px-3 py-2 border rounded"
                />
            </div>

            <div>
                <label className="block font-semibold">Testimonial</label>
                <textarea
                    {...register("testimonial", { required: true })}
                    className="w-full px-3 py-2 border rounded"
                ></textarea>
            </div>

            <button
                type="submit"
                className="bg-[#EF4D16] text-white px-4 py-2 rounded hover:bg-[#d63f0f]"
            >
                Submit
            </button>
        </form>
    );
};

export default TestimonialForm;
