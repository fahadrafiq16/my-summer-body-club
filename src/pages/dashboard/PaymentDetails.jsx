import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import InfoItem from './InfoItem';

const PaymentDetails = () => {
    const { id } = useParams();
    console.log(id);

    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState("");

    useEffect(() => {
        axios.get(`https://msbc-backend.vercel.app/api/get-userinfo/${id}`)
            .then((response) => {
                setUserInfo(response.data);
                setStatus(response.data.status); // Set status after fetching
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    if (loading) return <p className="text-center text-lg font-semibold">Loading...</p>;
    if (error) return <p className="text-red-500 text-center font-semibold">Error: {error}</p>;

    return (
        userInfo ? (
            <div className="max-w-3xl mx-auto p-6 m-6 bg-white shadow-lg my-12 rounded-lg border border-[#2d3a91]">
                {/* Title */}
                <h2 className="text-2xl font-bold text-[#2d3a91] mb-4">User Details</h2>

                {/* User Details */}
                <div className="grid grid-cols-3 gap-4">
                    <InfoItem label="Voornaam" value={userInfo.voornaam} />
                    <InfoItem label="Achternaam" value={userInfo.achternaam || "N/A"} />
                    <InfoItem label="Email" value={userInfo.email} />
                    <InfoItem label="Telefoonnummer" value={userInfo.telefoonnummer || "N/A"} />
                    <InfoItem label="Adres" value={userInfo.adres || "N/A"} />
                    <InfoItem label="Postcode" value={userInfo.postcode || "N/A"} />
                    <InfoItem label="Woonplaats" value={userInfo.woonplaats || "N/A"} />
                </div>

                {/* Training Information */}
                <h3 className="text-xl font-semibold text-[#ef4d16] mt-6">Training Details</h3>
                <div className="grid grid-cols-3 gap-4 mt-2">
                    <InfoItem label="Training Title" value={userInfo.selectedOption.trainingTitle} />
                    <InfoItem label="Abonnement Type" value={userInfo.selectedOption.abonnementType} />
                    <InfoItem label="Abonnement Title" value={userInfo.selectedOption.abonnementTitle} />
                    <InfoItem label="Amount" value={`€ ${userInfo.selectedOption.amount}`} />
                    <InfoItem label="Quantity" value={userInfo.selectedOption.quantity} />
                </div>

                {/* Status Dropdown */}
                <div className="mt-6">
                    <label className="text-[#2d3a91] font-semibold">Status:</label>
                    <select
                        value={status}
                        onChange={handleStatusChange}
                        className="block w-full p-2 border border-gray-300 rounded mt-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ef4d16]"
                    >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="open">Open</option>
                    </select>
                </div>

                {/* Total Amount */}
                <div className="mt-6">
                    <InfoItem label="Total Amount" value={`€ ${userInfo.totalAmount}`} />
                </div>
            </div>
        ) : (
            <p className="text-center text-lg font-semibold">No data available</p>
        )
    );
};

export default PaymentDetails;
