import React, { useState, createContext } from 'react'
import TextField from '../../components/common/TextField'
import { useForm } from 'react-hook-form';
import RadioGroup from '../../components/common/RadioGroup';
import axios from 'axios';
import { Steps, StepsProvider, useSteps } from "react-step-builder";
import { FormProvider } from '../../contex/FormContex'
import StepOne from '../../components/multistepsform/StepOne';
import StepTwo from '../../components/multistepsform/StepTwo';
import StepThree from '../../components/multistepsform/StepThree';
import { paymentOptions,extraOptions, clubAmount, groepPtTrainingDescription } from '../../data/GroepPT';
import PaymentFormHeader from '../../components/common/PaymentFormHeader';


const GroepPTTraining = () => {
   
    return (
        <>
        <PaymentFormHeader />
            <FormProvider>
                <StepsProvider>
                    <div className="payment-form-page max-w-[850px] mx-auto sm:my-[60px] md:my-[100px]">
                        <Steps>
                            <StepOne trainingDescription={groepPtTrainingDescription}/>
                            <StepTwo />
                            <StepThree paymentOptions={paymentOptions} extraOptions={extraOptions} clubAmount={clubAmount} />    
                        </Steps>
                    </div>            
                </StepsProvider>
            </FormProvider>
        </>

    )
}

export default GroepPTTraining
