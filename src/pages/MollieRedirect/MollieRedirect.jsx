import React, { useState, useEffect } from 'react'
import PaymentFormHeader from '../../components/common/PaymentFormHeader'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const BASE_BACKEND_URL = process.env.REACT_APP_BASE_BACKEND_URL;

const MollieRedirect = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    // Extract parameters from the query string
    const name = queryParams.get('name');
    const selectedOption = queryParams.get('selectedOption');
    const subTitle = queryParams.get('subTitle');
    const email = queryParams.get('email');

    const [allPayments, setAllPayments] = useState([]);
    const [matchedPayment, setMatchedPayment] = useState(null);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axios.get(`${BASE_BACKEND_URL}/api/fetch-payments`, {
                    headers: {
                        'Accept': 'application/json', // Ensure the response is in JSON format
                    }
                });
                setAllPayments(response.data);


                // Find the payment where name and email match
                const match = response.data.find(payment =>
                    payment.metadata?.userInfo?.voornaam === name &&
                    payment.metadata?.userInfo?.email === email
                );


                setMatchedPayment(match); // Set the matched payment
                console.log('Matched Payment:', match);
   

                try {
                    const dataToSend = {
                        ...match.metadata?.userInfo,
                        status:match.status,
                    }
                    const response = await axios.post(`${BASE_BACKEND_URL}/api/add-user`, dataToSend, {
                        headers: { "Content-Type": "application/json" },
                    });
                    console.log("✅ User added successfully:", response.data);
                    return response.data;
                } catch (error) {
                    console.error("❌ Error adding user:", error.response?.data || error.message);
                }


            } catch (error) {
                console.error('Error fetching payments:', error);
            }
        }

        fetchPayments();

    }, [name, email]);

    const navigate = useNavigate();

 


    return (
        <>
            <PaymentFormHeader />

            <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg my-10">
                <h1 className="text-2xl font-bold text-center text-secondary border-b-2 border-primary pb-2 mb-6">
                    Bedankt voor je inschrijving!
                </h1>

                <div className="space-y-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 200 200"
                        width="100px"
                        height="100px"
                    >
                        {/* Background Circle */}
                        <circle cx="100" cy="100" r="95" fill="#ef4d16" stroke="#2d3994" strokeWidth="4" />

                        {/* Eyes */}
                        <circle cx="70" cy="80" r="10" fill="#2d3994" />
                        <circle cx="130" cy="80" r="10" fill="#2d3994" />

                        {/* Smile */}
                        <path
                            d="M60 120 Q100 160, 140 120"
                            fill="none"
                            stroke="#2d3994"
                            strokeWidth="5"
                            strokeLinecap="round"
                        />

                        {/* Stars */}
                        <polygon
                            points="20,30 25,40 35,40 27,47 30,57 20,50 10,57 13,47 5,40 15,40"
                            fill="#2d3994"
                        />
                        <polygon
                            points="180,30 185,40 195,40 187,47 190,57 180,50 170,57 173,47 165,40 175,40"
                            fill="#2d3994"
                        />

                        {/* Confetti */}
                        <rect x="30" y="160" width="10" height="10" fill="#2d3994" transform="rotate(45 35 165)" />
                        <rect x="160" y="160" width="10" height="10" fill="#2d3994" transform="rotate(-45 165 165)" />


                    </svg>
                    <p className="text-lg">
                        <strong className="text-secondary">Beste</strong>{' '}
                        <span className="text-gray-700">{name},</span>
                    </p>
                    <p className="text-gray-700">
                        Welkom bij My Summerbody Club! We zijn blij je als nieuw lid te verwelkomen. Binnenkort nemen we contact met je op voor het inplannen van je trainingen.
                    </p>
                    <p className="text-gray-700">
                        De bevestiging van je betaling ontvang je ook per e-mail.
                    </p>
                    <p className="text-gray-700">
                        Heb je vragen of speciale verzoeken, aarzel dan niet om contact met ons op te nemen. We staan altijd voor je klaar!
                    </p>
                    <p className="text-gray-700">
                        Tot snel!
                    </p>
                    <p className="text-gray-700">
                        Met vriendelijke groet,
                    </p>
                    <p className="text-gray-700 mt-[0px]">
                        Team My Summerbody Club
                    </p>
                </div>
            </div>

        </>
    )
}

export default MollieRedirect
