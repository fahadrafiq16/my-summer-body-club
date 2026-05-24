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
    summerBodyTrainingDescription6Maanden as defaultSummerBodyTrainingDescription6Maanden,
} from '../../data/Summerbody6maanden';
import PaymentFormHeader from '../../components/common/PaymentFormHeader';
import { getBackendBaseUrl } from '../../utils/backend';

const PROGRAM_KEY = 'summerbody-6-maanden';

const Summerbody6maanden = () => {
    const [paymentOptions, setPaymentOptions] = useState(defaultPaymentOptions);
    const [extraOptions, setExtraOptions] = useState(defaultExtraOptions);
    const [clubAmount, setClubAmount] = useState(defaultClubAmount);
    const [summerBodyTrainingDescription6Maanden, setSummerBodyTrainingDescription6Maanden] = useState(defaultSummerBodyTrainingDescription6Maanden);

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
                    const localImage = defaultSummerBodyTrainingDescription6Maanden?.[0]?.featuredImage;
                    setSummerBodyTrainingDescription6Maanden(
                        data.trainingDescription.map((d) => ({ ...d, featuredImage: localImage }))
                    );
                }
            } catch (err) {
                console.warn('Falling back to static Summerbody6maanden data:', err?.message);
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
                            <StepOne trainingDescription={summerBodyTrainingDescription6Maanden} />
                            <StepTwo trainingDescription={summerBodyTrainingDescription6Maanden} />
                            <StepThree trainingDescription={summerBodyTrainingDescription6Maanden} paymentOptions={paymentOptions} extraOptions={extraOptions} clubAmount={clubAmount} />
                        </Steps>
                    </div>
                </StepsProvider>
            </FormProvider>
        </>
    )
}

export default Summerbody6maanden
