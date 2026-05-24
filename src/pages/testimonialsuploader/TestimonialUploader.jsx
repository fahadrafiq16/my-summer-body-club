import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { getBackendBaseUrl } from "../../utils/backend";

const TRAINING_OPTIONS = [
    { value: "personal-training", label: "Personal Training" },
    { value: "groep-pt", label: "Groep PT Training" },
    { value: "wedstrijd-training", label: "Wedstrijd Training" },
    { value: "afvallen-training", label: "Afvallen Training" },
    { value: "summerbody-1jarig", label: "Summerbody 1 jarig" },
    { value: "summerbody-6-maanden", label: "Summerbody 6 maanden" },
    { value: "summerbody-flex", label: "Summerbody Flex" },
    { value: "bootcamp-training", label: "Bootcamp Training" },
    { value: "pt-ruimte", label: "PT Ruimte" },
];

const TestimonialUploader = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);

    const onDrop = useCallback((accepted) => {
        const f = accepted?.[0];
        if (!f) return;
        setFile(f);
        setPreview(URL.createObjectURL(f));
    }, []);

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"] },
        maxSize: 5 * 1024 * 1024,
        multiple: false,
    });

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const removeImage = () => {
        if (preview) URL.revokeObjectURL(preview);
        setFile(null);
        setPreview("");
        setUploadProgress(0);
    };

    const uploadToBackend = async () => {
        if (!file) return { url: "", publicId: "" };
        const formData = new FormData();
        formData.append("image", file);
        const res = await axios.post(`${getBackendBaseUrl()}/api/upload-image`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (e) => {
                if (e.total) setUploadProgress(Math.round((e.loaded * 100) / e.total));
            },
        });
        if (!res.data?.success) throw new Error(res.data?.error || "Image upload failed");
        return { url: res.data.url, publicId: res.data.publicId };
    };

    const onSubmit = async (data) => {
        if (!rating || rating < 1 || rating > 5) {
            setMessage({ type: "error", text: "Please select a rating (1-5 stars)" });
            return;
        }

        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const { url: imageUrl, publicId: imagePublicId } = await uploadToBackend();

            const response = await axios.post(
                `${getBackendBaseUrl()}/api/customers-feedback`,
                {
                    name: data.name.trim(),
                    trainingType: data.trainingType || "",
                    rating,
                    testimonial: data.testimonial.trim(),
                    imageUrl,
                    imagePublicId,
                },
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.data.success) {
                setMessage({ type: "success", text: "Feedback submitted successfully!" });
                reset();
                setRating(0);
                removeImage();
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            setMessage({
                type: "error",
                text: error.response?.data?.error || error.message || "Failed to submit feedback",
            });
        } finally {
            setLoading(false);
        }
    };

    const dropzoneCls = `border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors h-full min-h-[140px] flex items-center justify-center ${
        isDragReject
            ? "border-red-400 bg-red-50"
            : isDragActive
                ? "border-[#EF4D16] bg-orange-50"
                : "border-gray-300 hover:border-[#EF4D16] hover:bg-orange-50"
    }`;

    return (
        <div className="max-w-2xl mx-auto p-6 m-12 border rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Submit Your Feedback</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Soort Training (training dropdown) — TOP */}
                <div>
                    <label className="block font-semibold mb-2">
                        Soort Training <span className="text-red-500">*</span>
                    </label>
                    <select
                        {...register("trainingType", { required: "Selecteer een training" })}
                        defaultValue=""
                        className="w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#EF4D16]"
                    >
                        <option value="" disabled>Kies een training…</option>
                        {TRAINING_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    {errors.trainingType && (
                        <p className="text-red-500 text-sm mt-1">{errors.trainingType.message}</p>
                    )}
                </div>

                {/* Name */}
                <div>
                    <label className="block font-semibold mb-2">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        {...register("name", {
                            required: "Name is required",
                            minLength: { value: 2, message: "Name must be at least 2 characters" },
                        })}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#EF4D16]"
                        placeholder="Enter your name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                {/* Rating + Image (side by side) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Rating */}
                    <div>
                        <label className="block font-semibold mb-2">
                            Rating <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
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

                    {/* Image upload (react-dropzone) */}
                    <div>
                        <label className="block font-semibold mb-2">
                            Foto <span className="text-gray-400 text-sm">(optional)</span>
                        </label>

                        {!preview ? (
                            <div {...getRootProps()} className={dropzoneCls}>
                                <input {...getInputProps()} />
                                <div className="text-sm text-gray-600">
                                    {isDragActive
                                        ? "Drop the image here…"
                                        : "Sleep een foto hierheen, of klik om te selecteren"}
                                    <div className="text-xs text-gray-400 mt-1">PNG / JPG / WEBP — max 5 MB</div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative rounded-md overflow-hidden border h-full min-h-[140px] flex items-center justify-center bg-gray-50">
                                <img
                                    src={preview}
                                    alt="preview"
                                    className="max-h-[180px] w-auto object-contain"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 bg-white/90 text-red-600 rounded-full w-7 h-7 flex items-center justify-center shadow hover:bg-white"
                                    aria-label="Remove image"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {loading && file && uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="mt-2 h-1.5 w-full bg-gray-200 rounded">
                                <div
                                    className="h-1.5 bg-[#EF4D16] rounded transition-all"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Testimonial */}
                <div>
                    <label className="block font-semibold mb-2">
                        Feedback <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        {...register("testimonial", {
                            required: "Feedback is required",
                            minLength: { value: 10, message: "Feedback must be at least 10 characters" },
                        })}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#EF4D16]"
                        rows="4"
                        placeholder="Write your feedback here..."
                    />
                    {errors.testimonial && (
                        <p className="text-red-500 text-sm mt-1">{errors.testimonial.message}</p>
                    )}
                </div>

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
