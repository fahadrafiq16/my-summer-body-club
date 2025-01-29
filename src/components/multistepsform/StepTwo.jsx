import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import TextField from '../common/TextField';
import { useFormContext } from '../../contex/FormContex'
import { useSteps } from 'react-step-builder';
import PrevButton from './PrevButton';
import NextButton from './NextButton';
import StepProgress from './StepProgress';
import BorderedHeader from './BorderedHeader';
import axios from 'axios'
import { useLocation } from "react-router-dom";

const ADRES_API_KEY = process.env.REACT_APP_ADRES_API_KEY;

const StepTwo = () => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
        
    }, [location.pathname]);


    const { formData, updateFormData } = useFormContext();

    const { next, prev } = useSteps();

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: formData,
    });

    const onSubmit = (data) => {
        updateFormData(data);
        next(); // Move to the next step
    };


    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <StepProgress title={'Adres & Contactgegevens'} />

                <BorderedHeader heading={'Adresgegevens'} />
                <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4">
                    <TextField
                        label="Postcode:"
                        name="postcode"
                        register={register}
                        validation={{
                            //required: 'Voornaam is required',
                        }}
                        errors={errors}
                        placeholder=""
                    />

                    <TextField
                        label="Huisnummer:"
                        name="huisnummer"
                        register={register}
                        validation={{
                            //required: 'Voornaam is required',
                        }}
                        errors={errors}
                        placeholder=""
                    />

                    <TextField
                        label="Toevoeging (Optioneel):"
                        name="toevoeging"
                        register={register}
                        validation={{
                            //required: 'Voornaam is required',
                        }}
                        errors={errors}
                        placeholder=""
                    />
                </div>

                <TextField
                    label="Adres:"
                    name="adres"
                    register={register}
                    validation={{
                        //required: 'Voornaam is required',
                    }}
                    errors={errors}
                    placeholder=""
                />

                <TextField
                    label="Woonplaats:"
                    name="woonplaats"
                    register={register}
                    validation={{
                        //required: 'Voornaam is required',
                    }}
                    errors={errors}
                    placeholder=""
                />

                <BorderedHeader heading={'Contactgegevens'} />

                <TextField
                    label="Telefoonnummer:"
                    name="telefoonnummer"
                    register={register}
                    validation={{
                        //required: 'Voornaam is required',
                    }}
                    errors={errors}
                    placeholder=""
                />

                <TextField
                    label="Email:"
                    name="email"
                    register={register}
                    validation={{
                        required: 'Email is required',
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: 'Invalid email address',
                        },
                    }}
                    errors={errors}
                    placeholder=""
                />

                <div className="flex gap-4">
                    <PrevButton title={'Terug'} />
                    <NextButton title={'Volgende'} />
                </div>
            </form>

        </>

    )
}

export default StepTwo
