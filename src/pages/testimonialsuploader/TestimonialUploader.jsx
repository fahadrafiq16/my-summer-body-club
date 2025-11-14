import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const BASE_BACKEND_URL = process.env.REACT_APP_BASE_BACKEND_URL;

const TestimonialUploader = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleRatingClick = (value) => {
        setRating(value);
    };

    const onSubmit = async (data) => {
        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            setMessage({ type: "error", text: "Please select a rating (1-5 stars)" });
            return;
        }

        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const response = await axios.post(
                `${BASE_BACKEND_URL}/api/customers-feedback`,
                {
                    name: data.name.trim(),
                    position: data.position?.trim() || "",
                    rating: rating,
                    testimonial: data.testimonial.trim()
                },
                {
                    headers: { "Content-Type": "application/json" }
                }
            );

            if (response.data.success) {
                setMessage({ type: "success", text: "Feedback submitted successfully!" });
                reset();
                setRating(0);
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            setMessage({
                type: "error",
                text: error.response?.data?.error || "Failed to submit feedback"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 m-12 border rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Submit Your Feedback</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name Field */}
                <div>
                    <label className="block font-semibold mb-2">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        {...register("name", { 
                            required: "Name is required",
                            minLength: { value: 2, message: "Name must be at least 2 characters" }
                        })}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#EF4D16]"
                        placeholder="Enter your name"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                </div>

                {/* Position Field */}
                <div>
                    <label className="block font-semibold mb-2">
                        Position <span className="text-gray-400 text-sm">(optional)</span>
                    </label>
                    <input
                        type="text"
                        {...register("position")}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#EF4D16]"
                        placeholder="bv. Lid / Ondernemer / Sporter"
                    />
                </div>

                {/* Rating Field */}
                <div>
                    <label className="block font-semibold mb-2">
                        Rating <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => handleRatingClick(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className="text-4xl transition-transform hover:scale-110 focus:outline-none"
                                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                            >
                                <span
                                    className={
                                        star <= (hoveredRating || rating)
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                    }
                                >
                                    ★
                                </span>
                            </button>
                        ))}
                    </div>
                    {rating > 0 ? (
                        <p className="text-sm text-green-600 font-medium">
                            Selected: {rating} star{rating > 1 ? "s" : ""}
                        </p>
                    ) : (
                        <p className="text-sm text-red-500">Please select a rating</p>
                    )}
                </div>

                {/* Testimonial Field */}
                <div>
                    <label className="block font-semibold mb-2">
                        Feedback <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        {...register("testimonial", { 
                            required: "Feedback is required",
                            minLength: { value: 10, message: "Feedback must be at least 10 characters" }
                        })}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#EF4D16]"
                        rows="4"
                        placeholder="Write your feedback here..."
                    ></textarea>
                    {errors.testimonial && (
                        <p className="text-red-500 text-sm mt-1">{errors.testimonial.message}</p>
                    )}
                </div>

                {/* Message Display */}
                {message.text && (
                    <div
                        className={`p-3 rounded ${
                            message.type === "success"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || rating === 0}
                    className="w-full bg-[#EF4D16] text-white px-4 py-2 rounded-md hover:bg-[#d63f0f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? "Submitting..." : "Submit Feedback"}
                </button>
            </form>
        </div>
    );
};

export default TestimonialUploader;

