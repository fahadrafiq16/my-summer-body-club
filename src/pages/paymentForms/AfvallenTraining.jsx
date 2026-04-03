import React, { useEffect, useState } from 'react'
import { Steps, StepsProvider } from "react-step-builder";
import { FormProvider } from '../../contex/FormContex'
import StepOne from '../../components/multistepsform/StepOne';
import StepTwo from '../../components/multistepsform/StepTwo';
import StepThree from '../../components/multistepsform/StepThree';
import {
    paymentOptions as fallbackPaymentOptions,
    extraOptions as fallbackExtraOptions,
    clubAmount as fallbackClubAmount,
    afvallenTrainingDescription as fallbackDescription,
    fetchAfvallenTrainingConfig,
} from '../../data/AfvallenTraining';
import PaymentFormHeader from '../../components/common/PaymentFormHeader';


const AfvallenTraining = () => {
    const [config, setConfig] = useState({
        paymentOptions: fallbackPaymentOptions,
        extraOptions: fallbackExtraOptions,
        clubAmount: fallbackClubAmount,
        afvallenTrainingDescription: fallbackDescription,
    });

    useEffect(() => {
        let mounted = true;
        const run = async () => {
            const remote = await fetchAfvallenTrainingConfig();
            if (!mounted) return;
            setConfig(remote);
        };
        run();
        return () => {
            mounted = false;
        };
    }, []);
   
    return (
        <>
        <PaymentFormHeader />
            <FormProvider>
                <StepsProvider>
                    <div className="payment-form-page max-w-[850px] mx-auto my-[100px]">
                        <Steps>
                            <StepOne trainingDescription={config.afvallenTrainingDescription}/>
                            <StepTwo trainingDescription={config.afvallenTrainingDescription} />
                            <StepThree
                                trainingDescription={config.afvallenTrainingDescription}
                                paymentOptions={config.paymentOptions}
                                extraOptions={config.extraOptions}
                                clubAmount={config.clubAmount}
                            />
                        </Steps>
                    </div>            
                </StepsProvider>
            </FormProvider>
        </>

    )
}

export default AfvallenTraining
