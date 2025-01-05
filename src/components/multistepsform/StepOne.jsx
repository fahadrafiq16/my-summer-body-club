import React from 'react'
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

const StepOne = ({ trainingDescription }) => {

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
            <StepProgress />
            <StepOneHeader trainingDescription={trainingDescription} />
            <BorderedHeader heading={'Persoonlijke gegevens'} />
            <TextField
                label="Voornaam:"
                name="voornaam"
                register={register}
                validation={{
                    required: 'Voornaam is required',
                }}
                errors={errors}
                placeholder=""
            />

            <TextField
                label="Tussen Voegsel"
                name="tussenvoegsel"
                register={register}
                validation={{}}
                errors={errors}
                placeholder=""
            />

            <TextField
                label="Achternaam:"
                name="achternaam"
                register={register}
                validation={{}}
                errors={errors}
                placeholder=""
            />


            <div className="select-gender">
                <label className="mt-[20px] text-left font-bold">Tussen Voegsel</label>
                <RadioGroup
                    name="geslachtooptions"
                    control={control}
                    options={geslachtoOptions}

                />
                {errors.geslachtooptions && (
                    <p className="text-red-500 text-left">{"This field is required"}</p>
                )}
            </div>

            <div className="text-left mt-4 mb-2">
                <label className="mt-[20px] text-left font-bold">Tussen Voegsel</label>
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4">

                <SelectField
                    name="dayOfMonth"
                    label=""
                    options={daysOfMonth}
                    register={register}
                    // validation={{ required: "This field is required" }}
                    errors={errors}
                />

                <SelectField
                    name="month"
                    label=""
                    options={months}
                    register={register}
                    //   validation={{ required: "This field is required" }}
                    errors={errors}
                />

                <SelectField
                    name="years"
                    label=""
                    options={years}
                    register={register}
                    //validation={{ required: "This field is required" }}
                    errors={errors}
                />
            </div>




            <div className="flex">
                <NextButton title={'Next'} />
            </div>

        </form>
    )
}

export default StepOne