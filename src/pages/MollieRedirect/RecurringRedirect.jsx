import React, { useState, useEffect } from 'react'
import PaymentFormHeader from '../../components/common/PaymentFormHeader'
import { useLocation } from 'react-router-dom'
import axios from 'axios'


const RecurringRedirect = () => {

    const [allPayments, setAllPayments] = useState([]);
    const [matchedPayment, setMatchedPayment] = useState(null);
    const [paymentCreated, setPaymentCreated] = useState(false);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    // Extract parameters from the query string
    const name = queryParams.get('name');
    const email = queryParams.get('email');

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/fetch-payments');
                setAllPayments(response.data);

                // Find the payment where name and email match
                const match = response.data.find(payment =>
                    payment.metadata?.userInfo?.voornaam === name &&
                    payment.metadata?.userInfo?.email === email
                );

                if (match) {

                    setMatchedPayment(match); // Set the matched payment
                    // console.log('Matched Payment:', match.metadata);

                    // Trigger subscription creation
                    await createSubscription(match.customerId, match.metadata.userInfo);
                }

            } catch (error) {
                console.error('Error fetching payments:', error);
            }
        }

        const createSubscription = async (customerId, userInfo) => {
            try {
                const response = await axios.post('http://localhost:5000/api/create-subscription', { customerId, userInfo, });
                console.log('Subscription created successfully:', response.data);
                if (response.data) {
                    setPaymentCreated(true);
                    console.log('Matched', userInfo);

                    try {

                        // Call the recurring email API
                        const emailResponse = await axios.post('http://localhost:5000/api/recurring-email', { userInfo });
                        console.log('Email sent successfully:', emailResponse.data);

                    } catch (emailError) {
                        console.error('Error sending email:', emailError);
                    }

                }
            } catch (error) {
                console.error('Error creating subscription:', error);
            }
        };

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

export default RecurringRedirect
