import React, { useState, useEffect } from 'react'
import PaymentFormHeader from '../../components/common/PaymentFormHeader'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import FailedPaymentHeader from '../../components/common/FailedPaymentHeader'
import { useNavigate } from "react-router-dom";

const BASE_FRONTEND_URL = process.env.REACT_APP_BASE_FRONTEND_URL;
const BASE_BACKEND_URL = process.env.REACT_APP_BASE_BACKEND_URL;
const BASE_NGROK_URL = process.env.REACT_APP_NGROK_BACKEND_URL;

const RecurringRedirect = () => {

    const [allPayments, setAllPayments] = useState([]);
    const [matchedPayment, setMatchedPayment] = useState(null);
    const [paymentCreated, setPaymentCreated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);


    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    // Extract parameters from the query string
    const name = queryParams.get('name');
    const email = queryParams.get('email');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPayments = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${BASE_NGROK_URL}/api/fetch-payments`, {
                    headers: {
                        'ngrok-skip-browser-warning': 'true', // Skip the ngrok warning page
                        'Accept': 'application/json', // Ensure the response is in JSON format
                    }
                });
                //console.log('Ngore', response);
                setAllPayments(response.data);

                // Find the payment where name and email match
                const match = response.data.find(payment =>
                    payment.metadata?.userInfo?.voornaam === name &&
                    payment.metadata?.userInfo?.email === email
                );

                if (match) {

                    setMatchedPayment(match); // Set the matched payment
                    console.log('Matched Payment:', match.status);

                    if (match.status !== 'failed') {
                        // Trigger subscription creation
                        setPaymentStatus(true);
                        await createSubscription(match.customerId, match.metadata.userInfo);
                    } else {
                        setLoading(false);
                        setPaymentStatus(false);
                        await failedPaymentEmail(match.customerId, match.metadata.userInfo);
                    }
                }

            } catch (error) {
                console.error('Error fetching payments:', error);
            } finally {
                // Start the 10-second timer for redirection
                setTimeout(() => {
                    navigate("/"); // Redirect to the home page
                }, 10000);
            }
        }

        const createSubscription = async (customerId, userInfo) => {
            try {
                const response = await axios.post(`${BASE_BACKEND_URL}/api/create-subscription`, { customerId, userInfo, });
                console.log('Subscription created successfully:', response.data);
                if (response.data) {
                    setPaymentCreated(true);
                    console.log('Matched', userInfo);

                    try {

                        // Call the recurring email API
                        const emailResponse = await axios.post(`${BASE_BACKEND_URL}/api/recurring-email`, { userInfo });
                        console.log('Email sent successfully:', emailResponse.data);


                    } catch (emailError) {
                        console.error('Error sending email:', emailError);
                    } finally {
                        // Start the 10-second timer for redirection
                        setTimeout(() => {
                            navigate("/"); // Redirect to the home page
                        }, 10000);
                    }

                }
            } catch (error) {
                console.error('Error creating subscription:', error);
            }
            setLoading(false);
        };

        const failedPaymentEmail = async (customerId, userInfo) => {
            try {
                const emailResponse = await axios.post(`${BASE_BACKEND_URL}/api/failed-email`, { userInfo });
                console.log('Failed Email sent successfully:', emailResponse.data);
            } catch (emailError) {
                console.error('Error sending email:', emailError);
            }
        }

        fetchPayments();

    }, [name, email]);

    return (
        <>
            {
                !loading && paymentStatus && (
                    <PaymentFormHeader />
                )
            }

            {
                !loading && !paymentStatus && (

                    <>
                        <FailedPaymentHeader />


                    </>
                )
            }

            <div className=" max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg my-16 border border-[#ef4d16]">
                <h1 className="text-2xl font-bold text-center text-secondary border-b-2 border-primary pb-2 mb-6">

                    {
                        loading ? <div className="loader-mega w-4 h-4 border-2 border-white rounded-full animate-spin"></div> : ''
                    }
                </h1>
                {
                    !loading && paymentStatus && (
                        <>
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
                                    <span className="text-gray-700">{name}</span>
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
                        </>
                    )
                }

                {
                    !loading && !paymentStatus && (
                        <>
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

                                {/* Sad Mouth */}
                                <path
                                    d="M60 140 Q100 100, 140 140"
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
                            <p className="text-lg mt-4">
                                <strong className="text-secondary">Beste</strong>{' '}
                                <span className="text-gray-700">{name}</span>
                            </p>
                            <p className="text-gray-700 mt-4">
                                Je betaling en inschrijving voor is helaas niet gelukt.
                            </p>
                            <p className="text-gray-700">
                                Er is geen bedrag van je rekening argeschreven.
                            </p>
                            <p className="text-gray-700 mt-4">
                                Wij raden je aan om je gegevens en e-mailadres nogmaals te controleren en vervolgens opnieuw te proberen je in te schrijven.
                            </p>
                            <p className="text-gray-700 mt-4">
                                Met vriendelijke groet,
                            </p>
                            <p className="text-gray-700 mt-[0px]">
                                Team My Summerbody Club
                            </p>
                        </>
                    )
                }

            </div>

        </>
    )
}

export default RecurringRedirect
