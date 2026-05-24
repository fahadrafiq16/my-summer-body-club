import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Steps, StepsProvider } from 'react-step-builder';
import { FormProvider } from '../../contex/FormContex';
import StepOne from '../../components/multistepsform/StepOne';
import StepTwo from '../../components/multistepsform/StepTwo';
import StepThree from '../../components/multistepsform/StepThree';
import {
    paymentOptions as defaultPaymentOptions,
    extraOptions as defaultExtraOptions,
    clubAmount as defaultClubAmount,
    summerBodyTrainingDescription as defaultSummerBodyTrainingDescription,
} from '../../data/Summerbody1jarig';
import PaymentFormHeader from '../../components/common/PaymentFormHeader';
import { getBackendBaseUrl } from '../../utils/backend';

const PROGRAM_KEY = 'summerbody-1jarig';

const Summerbody1jarig = () => {
    const [paymentOptions, setPaymentOptions] = useState(defaultPaymentOptions);
    const [extraOptions, setExtraOptions] = useState(defaultExtraOptions);
    const [clubAmount, setClubAmount] = useState(defaultClubAmount);
    const [summerBodyTrainingDescription, setSummerBodyTrainingDescription] = useState(defaultSummerBodyTrainingDescription);

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
                    const localImage = defaultSummerBodyTrainingDescription?.[0]?.featuredImage;
                    setSummerBodyTrainingDescription(
                        data.trainingDescription.map((d) => ({ ...d, featuredImage: localImage }))
                    );
                }
            } catch (err) {
                console.warn('Falling back to static Summerbody1jarig data:', err?.message);
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
                            <StepOne trainingDescription={summerBodyTrainingDescription} />
                            <StepTwo trainingDescription={summerBodyTrainingDescription} />
                            <StepThree
                                trainingDescription={summerBodyTrainingDescription}
                                paymentOptions={paymentOptions}
                                extraOptions={extraOptions}
                                clubAmount={clubAmount}
                            />
                        </Steps>
                    </div>
                </StepsProvider>
            </FormProvider>
        </>
    );
};

export default Summerbody1jarig;
