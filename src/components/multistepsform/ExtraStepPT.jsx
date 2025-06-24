import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import TextField from '../common/TextField';
import { useFormContext } from '../../contex/FormContex'
import { useSteps } from 'react-step-builder';
import NextButton from './NextButton';
import StepProgress from './StepProgress';
import BorderedHeader from './BorderedHeader';
import RadioGroup from '../common/RadioGroup';
import SelectField from '../common/SelectField';
import StepOneHeader from '../common/StepOneHeader';
import PaymentFormHeader from '../common/PaymentFormHeader';

const geslachtoOptions = [
    {
        title: 'Man',
        amount: 'man',
    },
    {
        title: 'Vrouw',
        amount: 'vrouw',
    },
    {
        title: 'Neutraal',
        amount: 'neutraal',
    },
];

const daysOfMonth = Array.from({ length: 30 }, (_, i) => i + 1);

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const years = Array.from({ length: 2004 - 1940 + 1 }, (_, i) => 1940 + i);

const ExtraStepPT = ({ trainingDescription }) => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    console.log(trainingDescription);

    const { formData, updateFormData } = useFormContext();
    const { next, current, total } = useSteps();

    const { register, handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: formData,
    });

    const onSubmit = (data) => {
        updateFormData(data);
        next(); // Move to the next step
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <StepProgress title={'Persoonlijke gegevens'} />
            <StepOneHeader trainingDescription={trainingDescription} />
            <BorderedHeader heading={'Persoonlijke gegevens'} />
            <TextField
                label="Bedrijfsnaam:"
                name="bedrijfsnaam"
                register={register}
                validation={{
                    //required: 'KVK nummer is required',
                }}
                errors={errors}
                placeholder=""
            />


            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4">

                <TextField
                    label="KVK nummer:"
                    name="kvknummer"
                    register={register}
                    validation={{
                        //required: 'KVK nummer is required',
                    }}
                    errors={errors}
                    placeholder=""
                />
                <TextField
                    label="BTW nummer:"
                    name="BTWnummer"
                    register={register}
                    validation={{
                        //required: 'BTW nummer is required',
                    }}
                    errors={errors}
                    placeholder=""
                />

                <TextField
                    label="Bedrijfs e-mail:"
                    name="bedrijfsemail"
                    register={register}
                    validation={{
                       // required: 'Bedrijfs Email is required',
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: 'Invalid email address',
                        },
                    }}
                    errors={errors}
                    placeholder=""
                />

            </div>

            <TextField
                label="Heb je nog vragen?:"
                name="tussenvoegsel"
                register={register}
                validation={{}}
                errors={errors}
                placeholder=""
            />


           






            <div className="flex">
                <NextButton title={'Volgende'} />
            </div>

        </form>
    )
}

export default ExtraStepPT