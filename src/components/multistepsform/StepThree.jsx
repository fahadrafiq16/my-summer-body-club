import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import RadioGroup from '../../components/common/RadioGroup';
import { useFormContext } from '../../contex/FormContex'
import axios from 'axios';
import { useSteps } from 'react-step-builder';
import PrevButton from './PrevButton';
import NextButton from './NextButton';
import StepProgress from './StepProgress';
import PaymentBox from '../common/PaymentBox';
import ExtraDescription from './ExtraDescription';
const BASE_FRONTEND_URL = process.env.REACT_APP_BASE_FRONTEND_URL;
const BASE_BACKEND_URL = process.env.REACT_APP_BASE_BACKEND_URL;

const StepThree = ({ paymentOptions, extraOptions, clubAmount }) => {

    const { formData, updateFormData, setFormData } = useFormContext();
    const [selectedOption, setSelectedOption] = useState(null);
    const [extraOption, setExtraOption] = useState({
        amount: 0, // Initialize amount as 0
        title: 'Geen',
    });
    const { next, prev } = useSteps();

    const { control, handleSubmit, watch, resetField, reset, formState: { errors } } = useForm({
        defaultValues: formData,
    });

    const watchedRadio = watch('paymentOption');
    const watchedExtra = watch('extraOption');

    useEffect(() => {

        if (watchedRadio) {
            const matchedOption = paymentOptions.find(
                (option) => option.amount === watchedRadio
            );
            setSelectedOption(matchedOption);
        }

        if (watchedExtra) {
            const matchedExtra = extraOptions.find(
                (option) => option.amount === watchedExtra
            );
            setExtraOption(matchedExtra);
        }
        if (selectedOption?.extra === false) {
            resetField("extraOption");
            setExtraOption({
                amount: 0,
                title: 'Geen',
            })
        }
    }, [watchedRadio, watchedExtra]);

    const onSubmit = async (data) => {
        updateFormData(data);



        const totalAmount = (parseFloat(data.paymentOption) + parseFloat(clubAmount[0].amount) + parseFloat(extraOption.amount)).toFixed(2);



        console.log(totalAmount);

        if (!selectedOption.recurring) {

            setFormData((prev) => ({ ...prev, loading: true, totalAmount: totalAmount }));
            console.log('form', formData);

            try {
                const response = await axios.post(`${BASE_BACKEND_URL}/api/create-payment`, {
                    amount: totalAmount,
                    userInfo: {
                        ...formData,
                        selectedOption: selectedOption,
                        extraOption: extraOption,
                        totalAmount: totalAmount,
                        clubAmount: parseFloat(clubAmount[0].amount),
                    },
                });

                if (response.data.paymentUrl) {
                    window.location.href = response.data.paymentUrl;
                } else {
                    alert('Error fetching Mollie API');
                }
            } catch (error) {
                console.error('Error creating payment:', error);

            }
        } else {
            setFormData((prev) => ({ ...prev, loading: true, totalAmount: totalAmount }));
            try {

                const response = await axios.post(`${BASE_BACKEND_URL}/api/create-recurring-payment`, {
                    email: data.email,
                    name: data.voornaam,
                    userInfo: {
                        ...formData,
                        selectedOption: selectedOption,
                        extraOption: extraOption,
                        totalAmount: totalAmount,
                        clubAmount: parseFloat(clubAmount[0].amount),
                    },
                });

                if (response.data.paymentUrl) {
                    window.location.href = response.data.paymentUrl;
                }

            } catch (error) {
                console.error('Error initiating recurring payment:', error);
            }
        }

    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <StepProgress title={'Looptijd abonnement kiezen'} />

                <RadioGroup
                    name="paymentOption"
                    control={control}
                    options={paymentOptions}

                />


                {/* Conditionally render Extra Option if selectedOption.extra is true */}
                {selectedOption?.extra && (
                    <>
                        <ExtraDescription />
                        <RadioGroup
                            name="extraOption"
                            control={control}
                            options={extraOptions}
                            required={false}
                        />
                    </>
                )}

                {errors.paymentOption && (
                    <p className="text-red-500">{errors.paymentOption.message}</p>
                )}
                {
                    selectedOption &&
                    <div className="payment-boxes">
                        <PaymentBox selectedOption={selectedOption} extraOption={extraOption} clubAmount={clubAmount} />
                    </div>
                }

                <div className="flex gap-4">
                    <PrevButton title={'Terug'} />
                    <button
                        type="submit"
                        className="bg-[#F04D17] text-white px-4 py-2 mt-4 flex-1"
                        disabled={formData.loading}
                    >
                        {formData.loading ? (
                            <div className="loader w-4 h-4 border-2 border-white rounded-full animate-spin"></div>
                        ) : (
                            'Submit'
                        )}
                    </button>
                </div>
            </form>
        </>
    )
}

export default StepThree
