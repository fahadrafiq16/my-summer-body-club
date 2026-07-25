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

const DEFAULT_CONTENT = {
    pageHeading: 'Ik wil een afspraak maken voor proefles:',
    dayTimeHeading: 'Kies dag & tijd',
    dayLabel: 'Proefles dag',
    timeLabel: 'Verzoektijd',
    noticeText: 'Let op! Je krijgt een bevestiging of de door jouw gekozen tijdstip vrij is voor een proefles.',
    gegevensHeading: 'Mijn gegevens',
    introText: 'Je ontvang de informatie over de door jouw aangevraade trainen zo snel mogelijk!',
    personalHeading: 'Persoonlijke gegevens',
    contactHeading: 'Contactgegevens',
    confirmText: 'Je bevestiging ontvang je op dit e-mailadres',
    trainingPrograms: [
        { title: 'Small Group Training (Gratis)', amount: 'small-group-training' },
        { title: 'Personal Training (Betaald) *', amount: 'personal-training' },
        { title: 'Duo PT (Betaald) *', amount: 'duo-pt' },
        { title: 'Wedstrijd Training (Betaald) *', amount: 'wedstrijd-training' },
        { title: 'Afvallen (Betaald) *', amount: 'afvallen' },
    ],
    trainingDays: [
        { title: 'Ma', amount: 'ma' },
        { title: 'Di', amount: 'di' },
        { title: 'Wo', amount: 'wo' },
        { title: 'Do', amount: 'do' },
        { title: 'Vr', amount: 'vr' },
        { title: 'Za', amount: 'za' },
    ],
    timePreferences: [
        { title: '07:30-08:30', amount: '07-30-08-30' },
        { title: '08:30-09:30', amount: '08-30-09-30' },
        { title: '09:30-10:30', amount: '09-30-10-30' },
        { title: '10:30-11:30', amount: '10-30-11-30' },
        { title: '16:00-17:00', amount: '16-00-17-00' },
        { title: '18:00-19:00', amount: '18-00-19-00' },
    ],
};

function mapLinks(links, fallback) {
    if (!Array.isArray(links) || !links.length) return fallback;
    const mapped = links
        .slice()
        .sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0))
        .map((item) => ({
            title: String(item?.title || '').trim(),
            amount: String(item?.url || '').trim(),
        }))
        .filter((item) => item.title && item.amount);
    return mapped.length ? mapped : fallback;
}

function mapGallery(items, fallback) {
    if (!Array.isArray(items) || !items.length) return fallback;
    const mapped = items
        .slice()
        .sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0))
        .map((item) => ({
            title: String(item?.imageUrl || '').trim(),
            amount: String(item?.linkUrl || '').trim(),
        }))
        .filter((item) => item.title && item.amount);
    return mapped.length ? mapped : fallback;
}

function parseBody(bodyText) {
    if (!bodyText || typeof bodyText !== 'string') return {};
    try {
        const parsed = JSON.parse(bodyText);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
        return { noticeText: bodyText };
    }
}

const Proefles = () => {
    const { register, handleSubmit, control, formState: { errors } } = useForm({});
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState(DEFAULT_CONTENT);

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            try {
                const base = getBackendBaseUrl();
                const res = await axios.get(`${base}/api/fetch-home-section/proefles-page`);
                if (!isMounted || !res.data?.success || !res.data.section) return;
                const section = res.data.section;
                const extra = parseBody(section.bodyText);
                setContent({
                    pageHeading: section.title || DEFAULT_CONTENT.pageHeading,
                    dayTimeHeading: section.buttonLabel || DEFAULT_CONTENT.dayTimeHeading,
                    dayLabel: section.photosButtonUrl || DEFAULT_CONTENT.dayLabel,
                    timeLabel: section.videosButtonUrl || DEFAULT_CONTENT.timeLabel,
                    noticeText: extra.noticeText || DEFAULT_CONTENT.noticeText,
                    gegevensHeading: section.footerColumn1Title || DEFAULT_CONTENT.gegevensHeading,
                    introText: section.footerLegalText || DEFAULT_CONTENT.introText,
                    personalHeading: section.footerColumn4Title || DEFAULT_CONTENT.personalHeading,
                    contactHeading: section.buttonUrl || DEFAULT_CONTENT.contactHeading,
                    confirmText: extra.confirmText || DEFAULT_CONTENT.confirmText,
                    trainingPrograms: mapLinks(section.footerColumn1Links, DEFAULT_CONTENT.trainingPrograms),
                    trainingDays: mapLinks(section.footerColumn4Links, DEFAULT_CONTENT.trainingDays),
                    timePreferences: mapGallery(section.galleryItems, DEFAULT_CONTENT.timePreferences),
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
                `${base}/api/proefles-email`,
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
            <TitleHeader title={'Proefles'} />
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

                    <BorderedHeader heading={content.dayTimeHeading} />

                    <div className="select-gender">
                        <label className="mt-[20px] text-left font-bold">{content.dayLabel}</label>
                        <RadioGroup
                            name="trainingdays"
                            control={control}
                            options={content.trainingDays}
                            showPrice={false}
                        />
                        {errors.trainingdays && (
                            <p className="text-red-500 text-left">{"This field is required"}</p>
                        )}
                    </div>

                    <div className="select-gender">
                        <label className="mt-[20px] text-left font-bold">{content.timeLabel}</label>
                        <RadioGroup
                            name="timepreference"
                            control={control}
                            options={content.timePreferences}
                            showPrice={false}
                        />
                        {errors.timepreference && (
                            <p className="text-red-500 text-left">{"This field is required"}</p>
                        )}
                    </div>

                    <p className="form-h3-p">
                        {content.noticeText}
                    </p>

                    <h3 className="form-h3">{content.gegevensHeading}</h3>
                    <div className="form-border" style={{ marginTop: '15px' }}></div>

                    <p className="form-h3-p">{content.introText}</p>

                    <h3 className="form-h3">{content.personalHeading}</h3>

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

                    <p className="font-bold mt-4 pb-2 border-b-2 border-[#ef4d16]">{content.confirmText}</p>

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
