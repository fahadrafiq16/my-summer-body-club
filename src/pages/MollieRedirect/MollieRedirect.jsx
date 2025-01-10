import React, { useState, useEffect } from 'react'
import PaymentFormHeader from '../../components/common/PaymentFormHeader'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
const BASE_FRONTEND_URL = process.env.REACT_APP_BASE_FRONTEND_URL;
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
                const response = await axios.get(`${BASE_BACKEND_URL}/api/fetch-payments`);
                setAllPayments(response.data);

                // Find the payment where name and email match
                const match = response.data.find(payment =>
                    payment.metadata?.userInfo?.voornaam === name &&
                    payment.metadata?.userInfo?.email === email
                );


                setMatchedPayment(match); // Set the matched payment
                console.log('Matched Payment:', match);
                console.log('Status:', match.status);


                console.log('All Payments', response.data);
            } catch (error) {
                console.error('Error fetching payments:', error);
            }
        }

        fetchPayments();

    }, [name, email]);


    return (
        <>
            <PaymentFormHeader />

            <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
                <h1 className="text-2xl font-bold text-center text-secondary border-b-2 border-primary pb-2 mb-6">
                    Payment Status: {matchedPayment?.status}
                </h1>
                <div className="space-y-4">
                    <p className="text-lg">
                        <strong className="text-secondary">Voornaam</strong>{' '}
                        <span className="text-gray-700">{name}</span>
                    </p>
                    <p className="text-gray-700">
                        BEDANKT VOOR JE INSCHRIJVING Welkom als nieuw lid van My Summerbody Club.  Wij nemen zo snel mogelijk contact met je op en je bevestiging wordt per e-mail gestuurd. Tot ziens, Team-My Summerbody Club
                    </p>
                </div>
            </div>

        </>
    )
}

export default MollieRedirect
