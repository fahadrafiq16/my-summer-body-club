// src/data/paymentData.js
import PersonalImage from '../images/groep-pt.png'
console.log(PersonalImage);

export const paymentOptions = [
    {
        trainingTitle:'Groep PT',
        amount: '45.00',
        quantity: '1',
        title: '| per uur | 1 Op 2 training | p.p',
        subTitle: 'Je Groep PT Training abonnement bij My Summerbody Club',
        abonnementType: 'Per uur',
        abonnementTitle: 'Training | 1 op 2 | Prijs p.p.',
        kosten: ['Kosten:'],
        totalKosten: ['Totaal Kosten'],
        extra: false,
    },
    {
        trainingTitle:'Groep PT',
        amount: '200.00',
        quantity: '3',
        title: 'p.m. | 1 Op 2 training | 3 maanden | Start Pakket | 2 x week trainen | p.p.',
        subTitle: 'Je Groep PT Training abonnement bij My Summerbody Club',
        abonnementType: '3 maanden | Start Pakket | Per maand',
        abonnementTitle: '2 x week trainen | 1 op 2 | Prijs p.p.',
        kosten: ['Pakket kosten: 3 x € 200,00', 'Kosten per maand: € 200,00'],
        totalKosten: ['Kosten 1e maand', 'Daarna maandelijkse kosten: € 200,00'],
        extra: true,
    },
    {
        trainingTitle:'Groep PT',
        amount: '175.00',
        quantity: '3',
        title: 'p.m. | 1 Op 3 training | 3 maanden | Start Pakket | 2 x week trainen | p.p.',
        subTitle: 'Je Groep PT Training abonnement bij My Summerbody Club',
        abonnementType: '3 maanden | Start Pakket | Per maand',
        abonnementTitle: '2 x week trainen | 1 op 2 | Prijs p.p.',
        kosten: ['Pakket kosten: 3 x € 175,00', 'Kosten per maand: € 175,00'],
        totalKosten: ['Kosten 1e maand', 'Daarna maandelijkse kosten: € 175,00'],
        extra: true,
    },
    {
        trainingTitle:'Groep PT',
        amount: '250.00',
        quantity: '3',
        title: 'p.m. | 1 Op 2 training | 3 maanden | Start Pakket | 3 x week trainen | p.p.',
        subTitle: 'Je Groep PT Training abonnement bij My Summerbody Club',
        abonnementType: '3 maanden | Start Pakket | Per maand',
        abonnementTitle: '3 x week trainen | 1 op 2 | Prijs p.p.',
        kosten: [' Pakket kosten: 3 x € 250,00 ', 'Kosten per maand: € 250,00 '],
        totalKosten: ['Kosten 1e maand', 'Daarna maandelijkse kosten: € 250,00'],
        extra: true,
    },
    {
        trainingTitle:'Groep PT',
        amount: '280.00',
        quantity: '1',
        title: 'p.m. | 1 Op 2 training | per maand | 2x week trainen | p.p.',
        subTitle: 'Je Groep PT Training abonnement bij My Summerbody Club',
        abonnementType: 'Maandelijks | Per maand',
        abonnementTitle: '2 x week trainen | 1 op 2 | Prijs p.p.',
        kosten: ['Kosten per maand: € 280,00'],
        totalKosten: ['Maandelijkse kosten: € 280,00'],
        extra: false,
    },
    {
        trainingTitle:'Groep PT',
        amount: '175.00',
        quantity: '1',
        title: '| 1 Op 2 training | 5 Rittenkaart * | p.p.',
        subTitle: 'Je Groep PT Training abonnement bij My Summerbody Club',
        abonnementType: '5 Rittenkaart',
        abonnementTitle: 'Training 1 op 2',
        kosten: ['Kosten:'],
        totalKosten: ['Totaal Kosten'],
        extra: false,
    },
    {
        trainingTitle:'Groep PT',
        amount: '350.00',
        quantity: '1',
        title: '| 1 Op 2 training | 10 Rittenkaart * | p.p.',
        subTitle: 'Je Groep PT Training abonnement bij My Summerbody Club',
        abonnementType: '10 Rittenkaart',
        abonnementTitle: 'Training 1 op 2',
        kosten: ['Kosten:'],
        totalKosten: ['Kosten 1e maand', 'Daarna maandelijkse kosten: € 1020,00'],
        extra: true,
    },
];

export const extraOptions = [
    {
        amount: '300',
        title: 'per 3 maanden | Standaard | Vegan | 3 Metingen | p.p.'
    },
    {
        amount: '500',
        title: 'per 3 maanden | Standaard | Vegan | 3 Metingen | Duo',
    }

];

export const clubAmount = [
    {
        amount: '0',
        title: 'Clubpas/ QR-code',
        status: false,
    }
];

export const groepPtTrainingDescription = [
    {
        title: 'Groep PT Training',
        quote: 'Wij ziijn hier om je te inspirenen, En willen dat je beter bent dan gisteren: Omdat je niet hebt opgegeven.',
        trainingFeatures: [
            'Doel gerichte training op maat',
            '100% persoonlijke aandacht',
            'Tussentijdse voortgangsmetingen',
            'Voedingsschema op maat (Optioneel)',
        ],
        startingPrice: '€ 95,00',
        tenure: 'Per uur',
        cardHeadline: 'My BFF',
        headLineBg: '#d602dd',
        featuredImage: PersonalImage,
        trainingLink: '/trainingprograms/groeppt-training/payment-form',
    }
];