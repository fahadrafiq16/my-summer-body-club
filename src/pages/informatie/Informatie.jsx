import React from 'react'
import TitleHeader from '../../components/common/TitleHeader';
import { useForm } from 'react-hook-form';
import TextField from '../../components/common/TextField';
import RadioGroup from '../../components/common/RadioGroup';
import BorderedHeader from '../../components/multistepsform/BorderedHeader';
import axios from "axios"

const BASE_BACKEND_URL = process.env.REACT_APP_BASE_BACKEND_URL;

const geslachtoOptions = [
    { title: 'Man', amount: 'man' },
    { title: 'Vrouw', amount: 'vrouw' },
    { title: 'Neutraal', amount: 'neutraal' },
];

const trainingPrograms = [
    { title: 'Small Group Training', amount: 'small-group-training' },
    { title: 'Personal Training', amount: 'personal-training' },
    { title: 'Duo PT', amount: 'duo-pt' },
    { title: 'Wedstrijd Training', amount: 'wedstrijd-training' },
    { title: 'Afvallen', amount: 'afvallen' },
];

const Informatie = () => {
    const { register, handleSubmit, control, formState: { errors } } = useForm({});
    const [loading, setLoading] = React.useState(false);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            console.log("Form Data:", data);

            const res = await axios.post(
                `${BASE_BACKEND_URL}/api/informatie-email`,
                { data } // ✅ backend expects { data }
            );

            if (res.data.success) {
                alert("✅ " + res.data.message);
            } else {
                alert("❌ " + res.data.message);
            }
        } catch (err) {
            console.error("Request Error:", err);
            alert("⚠️ Server error, email not sent");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TitleHeader title={'Informatie'} />
            <div className="payment-form-page informatie max-w-[800px] mx-auto my-[100px]">
                <h3 className="form-h3">Ik wil graag meer informatie over:</h3>
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="select-gender training-options">
                        <label className="mt-[20px] font-bold"></label>
                        <RadioGroup
                            name="trainingsoptions"
                            control={control}
                            options={trainingPrograms}
                        />
                        {errors.trainingsoptions && (
                            <p className="text-red-500 text-left">{"This field is required"}</p>
                        )}
                    </div>

                    <BorderedHeader heading={'Mijn gegevens'} />
                    <p className="form-h3-p">
                        Je ontvangt de informatie over de door jouw aangevraagde training zo snel mogelijk!
                        Vul eerst nog even je gegevens in.
                    </p>

                    <BorderedHeader heading={'Persoonlijke gegevens'} />

                    <TextField
                        label="Voornaam:"
                        name="voornaam"
                        register={register}
                        validation={{ required: 'Voornaam is required' }}
                        errors={errors}
                        placeholder=""
                    />

                    <TextField
                        label="Tussen Voegsel (Optioneel):"
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
                        validation={{ required: 'Achternaam is required' }}
                        errors={errors}
                        placeholder=""
                    />

                    <div className="select-gender">
                        <label className="mt-[20px] text-left font-bold">Geslacht</label>
                        <RadioGroup
                            name="geslachtooptions"
                            control={control}
                            options={geslachtoOptions}
                        />
                        {errors.geslachtooptions && (
                            <p className="text-red-500 text-left">{"This field is required"}</p>
                        )}
                    </div>

                    <BorderedHeader heading={'Contactgegevens'} />

                    <TextField
                        label="Telefoonnummer:"
                        name="telefoonnummer"
                        register={register}
                        validation={{}}
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#F04D17] text-white px-4 py-2 mt-4 flex-1 disabled:opacity-50"
                    >
                        {loading ? "Versturen..." : "Bericht verzenden"}
                    </button>
                </form>
            </div>
        </>
    )
}

export default Informatie
