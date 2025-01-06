import React from 'react'
import PaymentFormHeader from '../../components/common/PaymentFormHeader'
import { useLocation } from 'react-router-dom'

const MollieRedirect = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    // Extract parameters from the query string
    const name = queryParams.get('name');
    const selectedOption = queryParams.get('selectedOption');
    const subTitle = queryParams.get('subTitle');
    const email = queryParams.get('email');

    return (
        <>
            <PaymentFormHeader />
            <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
                <h1 className="text-2xl font-bold text-center text-secondary border-b-2 border-primary pb-2 mb-6">
                    Mollie Redirect
                </h1>
                <div className="space-y-4">
                    <p className="text-lg">
                        <strong className="text-secondary">Name:</strong>{' '}
                        <span className="text-gray-700">{name}</span>
                    </p>
                    <p className="text-lg">
                        <strong className="text-secondary">Selected Option:</strong>{' '}
                        <span className="text-gray-700">{selectedOption}</span>
                    </p>
                    <p className="text-lg">
                        <strong className="text-secondary">Sub Title:</strong>{' '}
                        <span className="text-gray-700">{subTitle}</span>
                    </p>
                    <p className="text-lg">
                        <strong className="text-secondary">Email:</strong>{' '}
                        <span className="text-gray-700">{email}</span>
                    </p>
                </div>
            </div>

        </>
    )
}

export default MollieRedirect
