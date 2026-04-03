import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import RadioGroup from '../../components/common/RadioGroup';
import { useFormContext } from '../../contex/FormContex'
import axios from 'axios';
import { useSteps } from 'react-step-builder';
import PrevButton from './PrevButton';
import NextButton from './NextButton';
import StepProgress from './StepProgress';
import PaymentBox from '../common/PaymentBox';
import ExtraDescription from './ExtraDescription';
import CheckboxField from '../common/CheckboxField';
import StepOneHeader from '../common/StepOneHeader';
import { getBackendBaseUrl } from '../../utils/backend';

const StepThree = ({ trainingDescription, paymentOptions, extraOptions, clubAmount }) => {

    const [enabled, setEnabled] = useState(false);
    const [clubAmountMongo, setClubAmountMongo] = useState(15);

    // ✅ Fetch initial value from DB
    useEffect(() => {
        const fetchToggle = async () => {
            try {
                const res = await axios.get(`${getBackendBaseUrl()}/api/toggle`);
                setEnabled(res.data.value);
                setClubAmountMongo(res.data.amount);
                console.log(res.data.value);
                console.log(res.data.amount);
            } catch (err) {
                console.error("Error fetching toggle:", err);
            }
        };
        fetchToggle();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { formData, updateFormData, setFormData } = useFormContext();
    const [selectedOption, setSelectedOption] = useState(null);
    const [extraOption, setExtraOption] = useState({
        amount: 0, // Initialize amount as 0
        title: 'Geen',
    });
    const [submitError, setSubmitError] = useState("");
    const { next, prev } = useSteps();

    const { control, handleSubmit, watch, resetField, reset, formState: { errors } } = useForm({
        defaultValues: formData,
    });

    const watchedRadio = watch('paymentOption');
    const watchedExtra = watch('extraOption');

    useEffect(() => {

        if (watchedRadio) {
            const matchedOption = paymentOptions.find(
                (option) => option.amount === watchedRadio
            );
            setSelectedOption(matchedOption);
        }

        if (watchedExtra) {
            const matchedExtra = extraOptions.find(
                (option) => option.amount === watchedExtra
            );
            setExtraOption(matchedExtra);
        }
        if (selectedOption?.extra === false) {
            resetField("extraOption");
            setExtraOption({
                amount: 0,
                title: 'Geen',
            })
        }
    }, [watchedRadio, watchedExtra]);

    const onSubmit = async (data) => {
        setSubmitError("");
        updateFormData(data);

        const baseFromForm = parseFloat(data.paymentOption);
        const baseFromOption = selectedOption?.amount != null ? parseFloat(selectedOption.amount) : NaN;
        const baseAmount = Number.isFinite(baseFromForm) ? baseFromForm : baseFromOption;
        const clubStatusEnabled = Boolean(clubAmount?.[0]?.status);
        const includeClubAmount = clubStatusEnabled && Boolean(enabled);
        const club = includeClubAmount ? parseFloat(clubAmountMongo) : 0;
        const extra = parseFloat(extraOption?.amount ?? 0);
        if (!Number.isFinite(baseAmount) || baseAmount <= 0) {
            alert('Selecteer een betalingsoptie (looptijd / abonnement).');
            return;
        }
        const total = baseAmount + (Number.isFinite(club) ? club : 0) + (Number.isFinite(extra) ? extra : 0);
        const totalAmount = total.toFixed(2);

        // Ensure programType is always included inside selectedOption (needed for MongoDB filtering)
        const programType =
            selectedOption?.programType ||
            (selectedOption?.recurring ? "club" : undefined);
        const selectedOptionPayload = selectedOption
            ? { ...selectedOption, ...(programType ? { programType } : {}) }
            : selectedOption;

        if (!selectedOption.recurring) {

            setFormData((prev) => ({ ...prev, loading: true, totalAmount: totalAmount }));
            const backendBase = getBackendBaseUrl();
            console.log('form', formData);
            console.log(backendBase);

            try {
                const response = await axios.post(`${backendBase}/api/create-payment`, {
                    amount: totalAmount,
                    userInfo: {
                        ...formData,
                        selectedOption: selectedOptionPayload,
                        extraOption: extraOption,
                        totalAmount: totalAmount,
                        clubAmount: Number.isFinite(club) ? club : 0,
                    },
                });

                if (response.data.paymentUrl) {
                    window.location.href = response.data.paymentUrl;
                } else {
                    alert('Error fetching Mollie API');
                }
            } catch (error) {
                console.error('Error creating payment:', error);

            }
        } else {
            setFormData((prev) => ({ ...prev, loading: true, totalAmount: totalAmount }));
            const backendBase = getBackendBaseUrl();
            try {
                // Block duplicate recurring registrations before Mollie 0.01 mandate step
                const eligibility = await axios.post(`${backendBase}/api/check-recurring-eligibility`, {
                    email: data.email,
                    voornaam: data.voornaam,
                });
                if (!eligibility?.data?.eligible) {
                    setFormData((prev) => ({ ...prev, loading: false }));
                    setSubmitError(eligibility?.data?.message || "Deze combinatie van voornaam en e-mailadres heeft al een actief terugkerend abonnement.");
                    return;
                }

                const response = await axios.post(`${backendBase}/api/create-recurring-payment`, {
                    email: data.email,
                    name: data.voornaam,
                    userInfo: {
                        ...formData,
                        selectedOption: selectedOptionPayload,
                        extraOption: extraOption,
                        totalAmount: totalAmount,
                        clubAmount: Number.isFinite(club) ? club : 0,
                    },
                });

                if (response.data.paymentUrl) {
                    try {
                        localStorage.setItem('msbc_recurring_userinfo', JSON.stringify({
                            ...formData,
                            selectedOption: selectedOptionPayload,
                            extraOption: extraOption,
                            totalAmount: totalAmount,
                            clubAmount: Number.isFinite(club) ? club : 0,
                        }));
                    } catch { /* ignore */ }
                    window.location.href = response.data.paymentUrl;
                }

            } catch (error) {
                console.error('Error initiating recurring payment:', error);
                setSubmitError(error?.response?.data?.message || "Er ging iets mis bij het starten van de terugkerende betaling.");
                setFormData((prev) => ({ ...prev, loading: false }));
            }
        }

    };

    return (
        <>
            <form className="form-step-2" onSubmit={handleSubmit(onSubmit)}>
                <StepProgress title={'Looptijd abonnement & betalingsmethode kiezen'} />
                {

                    trainingDescription[0].title !== 'Aanvraag verhuur PT ruimte1'
                        ? <StepOneHeader trainingDescription={trainingDescription} />
                        : null
                }



                <RadioGroup
                    name="paymentOption"
                    control={control}
                    options={paymentOptions}

                />


                {/* Conditionally render Extra Option if selectedOption.extra is true */}
                {selectedOption?.extra && (
                    <>
                        <ExtraDescription />
                        <RadioGroup
                            name="extraOption"
                            control={control}
                            options={extraOptions}
                            required={false}
                        />
                    </>
                )}

                {errors.paymentOption && (
                    <p className="text-red-500 mb-2">{errors.paymentOption.message}</p>
                )}
                {
                    selectedOption &&
                    <div className="payment-boxes">
                        <PaymentBox selectedOption={selectedOption} extraOption={extraOption} clubAmount={clubAmount} clubNewAmount={enabled} clubAmountMongo={clubAmountMongo} />
                    </div>
                }



                {
                    selectedOption?.programType === 'club' && (
                        <>
                            <div className="notice-payment mb-4">
                                <p className="notice">Je hebt gekozen voor een contract met betaling per 4 weken, de eerste betaling zal online of per kaart plaatsvinden.</p>

                            </div>


                        </>
                    )
                }

                {

                }

                <div className="checkboxes-area">
                    {
                        trainingDescription[0].title !== 'Bootcamp Training'
                            ? <CheckboxField
                                name="acceptTerms1"
                                title="Ik machtig My Summerbody Club om na de eerste betaling, de abonnementsgelden maandelijks via SEPA-incasso van mijn rekening af te schrijven. Deze machtiging blijft van kracht tot het einde van het abonnement of contract."
                                control={control}
                                rules={{
                                    required: "Akkoord voor toestemming om de abonnementsgelden automatisch te incasseren via SEPA-betalingen is verplicht.",
                                }}
                            /> : null
                    }




                    {

                        <CheckboxField
                            name="acceptTerms2"
                            title="Ik ga akkoord met de Algemene voorwaarden, Privacyverklaring en de Huisregels van My Summerbody Club."
                            control={control}
                            rules={{
                                required: "Akkoord te gaan met de algemene voorwaarden en de huisregels is verplicht",
                            }}
                        />

                    }


                </div>

                <div className="flex gap-4">
                    <PrevButton title={'Terug'} />
                    <button
                        type="submit"
                        className="bg-[#F04D17] text-white px-4 py-2 mt-4 flex-1"
                        disabled={formData.loading}
                    >
                        {formData.loading ? (
                            <div className="loader w-4 h-4 border-2 border-white rounded-full animate-spin"></div>
                        ) : (
                            'Nu Betalen'
                        )}
                    </button>
                </div>
                {submitError && (
                    <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-base font-medium text-red-700">
                        ❌ {submitError}
                    </p>
                )}
                <h4 className="text-center font-bold mt-4">Geen zorgen! Je hebt altijd 14 dagen bedenktijd na het afsluiten van je abonnement.</h4>
            </form>
        </>
    )
}

export default StepThree