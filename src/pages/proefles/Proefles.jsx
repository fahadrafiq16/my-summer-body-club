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
    { title: 'Small Group Training (Gratis)', amount: 'small-group-training' },
    { title: 'Personal Training (Betaald) *', amount: 'personal-training' },
    { title: 'Duo PT (Betaald) *', amount: 'duo-pt' },
    { title: 'Wedstrijd Training (Betaald) *', amount: 'wedstrijd-training' },
    { title: 'Afvallen (Betaald) *', amount: 'afvallen' },
];

const trainingDays = [
    { title: 'Ma', amount: 'ma' },
    { title: 'Di', amount: 'di' },
    { title: 'Wo', amount: 'wo' },
    { title: 'Do', amount: 'do' },
    { title: 'Vr', amount: 'vr' },
    { title: 'Za', amount: 'za' },
];


const timePreferences = [
    { title: '07:30-08:30', amount: '07-30-08-30' },
    { title: '08:30-09:30', amount: '08-30-09-30' },
    { title: '09:30-10:30', amount: '09-30-10-30' },
    { title: '10:30-11:30', amount: '10-30-11-30' },
    { title: '16:00-17:00', amount: '16-00-17-00' },
    { title: '18:00-19:00', amount: '18-00-19-00' },
];


const Proefles = () => {
    const { register, handleSubmit, control, formState: { errors } } = useForm({});
    const [loading, setLoading] = React.useState(false);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            console.log("Form Data:", data);

            const res = await axios.post(
                `${BASE_BACKEND_URL}/api/proefles-email`,
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
            <TitleHeader title={'Proefles'} />
            <div className="payment-form-page informatie max-w-[800px] mx-auto my-[100px]">
                <h3 className="form-h3">Ik wil een afspraak maken voor proefles:</h3>
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

                    <BorderedHeader heading={'Kies dag & tijd'} />

                    <div className="select-gender">
                        <label className="mt-[20px] text-left font-bold">Training days</label>
                        <RadioGroup
                            name="trainingdays"
                            control={control}
                            options={trainingDays}
                        />
                        {errors.trainingdays && (
                            <p className="text-red-500 text-left">{"This field is required"}</p>
                        )}
                    </div>

                    <div className="select-gender">
                        <label className="mt-[20px] text-left font-bold">Time preference</label>
                        <RadioGroup
                            name="timepreference"
                            control={control}
                            options={timePreferences}
                        />
                        {errors.timepreference && (
                            <p className="text-red-500 text-left">{"This field is required"}</p>
                        )}
                    </div>

                    <p className="form-h3-p">
                        Let op! Je krijgt een bevestiging of de door jouw gekozen tijdstip vrij is voor een proefles.
                    </p>

                    <h3 class="form-h3">Mijn gegevens</h3>
                    <div class="form-border" style={{ marginTop: '15px' }}></div>

                    <p class="form-h3-p">Je ontvang de informatie over de door jouw aangevraade trainen zo snel mogelijk!
                    </p>

                    <h3 class="form-h3">Persoonlijke gegevens</h3>

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

                    <p className="font-bold mt-4 pb-2 border-b-2 border-[#ef4d16]">Je bevestiging ontvang je op dit e-mailadres</p>

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

export default Proefles
