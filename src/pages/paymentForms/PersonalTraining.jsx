import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Steps, StepsProvider } from "react-step-builder";
import { FormProvider } from '../../contex/FormContex'
import StepOne from '../../components/multistepsform/StepOne';
import StepTwo from '../../components/multistepsform/StepTwo';
import StepThree from '../../components/multistepsform/StepThree';
import {
    paymentOptions as defaultPaymentOptions,
    extraOptions as defaultExtraOptions,
    clubAmount as defaultClubAmount,
    trainingDescription as defaultTrainingDescription,
} from '../../data/PersonalTraining';
import PaymentFormHeader from '../../components/common/PaymentFormHeader';
import { getBackendBaseUrl } from '../../utils/backend';
import { mergeTrainingDescriptionWithFeaturedImage } from '../../utils/programFeaturedImage';

const PROGRAM_KEY = 'personal-training';

const PersonalTraining = () => {
    const [paymentOptions, setPaymentOptions] = useState(defaultPaymentOptions);
    const [extraOptions, setExtraOptions] = useState(defaultExtraOptions);
    const [clubAmount, setClubAmount] = useState(defaultClubAmount);
    const [trainingDescription, setTrainingDescription] = useState(defaultTrainingDescription);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const res = await axios.get(`${getBackendBaseUrl()}/api/program-config/${PROGRAM_KEY}`);
                if (cancelled || !res?.data) return;
                const data = res.data;
                if (Array.isArray(data.paymentOptions) && data.paymentOptions.length > 0) {
                    setPaymentOptions(data.paymentOptions);
                }
                if (Array.isArray(data.extraOptions)) {
                    setExtraOptions(data.extraOptions);
                }
                if (Array.isArray(data.clubAmount)) {
                    setClubAmount(data.clubAmount);
                }
                if (Array.isArray(data.trainingDescription) && data.trainingDescription.length > 0) {
                    setTrainingDescription(
                        mergeTrainingDescriptionWithFeaturedImage(
                            data.trainingDescription,
                            defaultTrainingDescription,
                            data.featuredImageUrl
                        )
                    );
                }
            } catch (err) {
                console.warn('Falling back to static PersonalTraining data:', err?.message);
            }
        };
        load();
        return () => { cancelled = true; };
    }, []);

    return (
        <>
            <PaymentFormHeader />
            <FormProvider>
                <StepsProvider>
                    <div className="payment-form-page max-w-[850px] mx-auto my-[100px]">
                        <Steps>
                            <StepOne trainingDescription={trainingDescription} />
                            <StepTwo trainingDescription={trainingDescription} />
                            <StepThree trainingDescription={trainingDescription} paymentOptions={paymentOptions} extraOptions={extraOptions} clubAmount={clubAmount} />
                        </Steps>
                    </div>
                </StepsProvider>
            </FormProvider>
        </>
    )
}

export default PersonalTraining
