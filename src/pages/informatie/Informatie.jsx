import React, { useEffect, useState } from 'react'
import TitleHeader from '../../components/common/TitleHeader';
import { useForm } from 'react-hook-form';
import TextField from '../../components/common/TextField';
import RadioGroup from '../../components/common/RadioGroup';
import BorderedHeader from '../../components/multistepsform/BorderedHeader';
import axios from "axios"
import { getBackendBaseUrl } from '../../utils/backend';

const geslachtoOptions = [
    { title: 'Man', amount: 'man' },
    { title: 'Vrouw', amount: 'vrouw' },
    { title: 'Neutraal', amount: 'neutraal' },
];

const DEFAULT_TRAINING_PROGRAMS = [
    { title: 'Small Group Training', amount: 'small-group-training' },
    { title: 'Personal Training', amount: 'personal-training' },
    { title: 'Duo PT', amount: 'duo-pt' },
    { title: 'Wedstrijd Training', amount: 'wedstrijd-training' },
    { title: 'Afvallen', amount: 'afvallen' },
];

const DEFAULT_CONTENT = {
    pageHeading: 'Ik wil graag meer informatie over:',
    gegevensHeading: 'Mijn gegevens',
    introText:
        'Je ontvangt de informatie over de door jouw aangevraagde training zo snel mogelijk! Vul eerst nog even je gegevens in.',
    personalHeading: 'Persoonlijke gegevens',
    contactHeading: 'Contactgegevens',
    trainingPrograms: DEFAULT_TRAINING_PROGRAMS,
};

function mapTrainingOptions(links) {
    if (!Array.isArray(links) || !links.length) return DEFAULT_TRAINING_PROGRAMS;
    const mapped = links
        .slice()
        .sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0))
        .map((item) => ({
            title: String(item?.title || '').trim(),
            amount: String(item?.url || '').trim(),
        }))
        .filter((item) => item.title && item.amount);
    return mapped.length ? mapped : DEFAULT_TRAINING_PROGRAMS;
}

const Informatie = () => {
    const { register, handleSubmit, control, formState: { errors } } = useForm({});
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState(DEFAULT_CONTENT);

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            try {
                const base = getBackendBaseUrl();
                const res = await axios.get(`${base}/api/fetch-home-section/informatie-page`);
                if (!isMounted || !res.data?.success || !res.data.section) return;
                const section = res.data.section;
                setContent({
                    pageHeading: section.title || DEFAULT_CONTENT.pageHeading,
                    gegevensHeading: section.buttonLabel || DEFAULT_CONTENT.gegevensHeading,
                    introText: section.bodyText || DEFAULT_CONTENT.introText,
                    personalHeading: section.footerColumn1Title || DEFAULT_CONTENT.personalHeading,
                    contactHeading: section.footerColumn4Title || DEFAULT_CONTENT.contactHeading,
                    trainingPrograms: mapTrainingOptions(section.footerColumn1Links),
                });
            } catch {
                /* keep defaults */
            }
        };
        load();
        return () => {
            isMounted = false;
        };
    }, []);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const base = getBackendBaseUrl();
            const res = await axios.post(
                `${base}/api/informatie-email`,
                { data }
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
                <h3 className="form-h3">{content.pageHeading}</h3>
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="select-gender training-options">
                        <label className="mt-[20px] font-bold"></label>
                        <RadioGroup
                            name="trainingsoptions"
                            control={control}
                            options={content.trainingPrograms}
                            showPrice={false}
                        />
                        {errors.trainingsoptions && (
                            <p className="text-red-500 text-left">{"This field is required"}</p>
                        )}
                    </div>

                    <BorderedHeader heading={content.gegevensHeading} />
                    <p className="form-h3-p">
                        {content.introText}
                    </p>

                    <BorderedHeader heading={content.personalHeading} />

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
                            showPrice={false}
                        />
                        {errors.geslachtooptions && (
                            <p className="text-red-500 text-left">{"This field is required"}</p>
                        )}
                    </div>

                    <BorderedHeader heading={content.contactHeading} />

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
