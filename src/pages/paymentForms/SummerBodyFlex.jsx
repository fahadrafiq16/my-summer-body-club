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
    summerBodyTrainingDescriptionFlex as defaultSummerBodyTrainingDescriptionFlex,
} from '../../data/SummerBodyFlex';
import PaymentFormHeader from '../../components/common/PaymentFormHeader';
import { getBackendBaseUrl } from '../../utils/backend';

const PROGRAM_KEY = 'summerbody-flex';

const SummerBodyFlex = () => {
    const [paymentOptions, setPaymentOptions] = useState(defaultPaymentOptions);
    const [extraOptions, setExtraOptions] = useState(defaultExtraOptions);
    const [clubAmount, setClubAmount] = useState(defaultClubAmount);
    const [summerBodyTrainingDescriptionFlex, setSummerBodyTrainingDescriptionFlex] = useState(defaultSummerBodyTrainingDescriptionFlex);

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
                    const localImage = defaultSummerBodyTrainingDescriptionFlex?.[0]?.featuredImage;
                    setSummerBodyTrainingDescriptionFlex(
                        data.trainingDescription.map((d) => ({ ...d, featuredImage: localImage }))
                    );
                }
            } catch (err) {
                console.warn('Falling back to static SummerBodyFlex data:', err?.message);
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
                            <StepOne trainingDescription={summerBodyTrainingDescriptionFlex} />
                            <StepTwo trainingDescription={summerBodyTrainingDescriptionFlex} />
                            <StepThree trainingDescription={summerBodyTrainingDescriptionFlex} paymentOptions={paymentOptions} extraOptions={extraOptions} clubAmount={clubAmount} />
                        </Steps>
                    </div>
                </StepsProvider>
            </FormProvider>
        </>
    )
}

export default SummerBodyFlex
