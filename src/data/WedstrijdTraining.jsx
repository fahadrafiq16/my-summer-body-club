// src/data/paymentData.js
import PersonalImage from '../images/wedstrijd-training.jpg'
console.log(PersonalImage);

export const paymentOptions = [
    {
        trainingTitle:'Wedstrijd Trainingen',
        amount: '80.00',
        quantity: '1',
        title: '| per 1.5 uur | Training – 1 op 1',
        subTitle: 'Je Wedstrijd Training abonnement bij My Summerbody Club',
        abonnementType: 'Per uur',
        abonnementTitle: 'Training & Coaching | 1,00/1,5 uur',
        kosten: ['Kosten:'],
        totalKosten: ['Totaal Kosten'],
        extra: false,
        recurring:false,
    },
    {
        trainingTitle:'Wedstrijd Trainingen',
        amount: '945.00',
        quantity: '3',
        title: '| 3 maanden | Start Pakket | 3 x week trainen | incl.. vetmetingen',
        subTitle: 'Je Wedstrijd Training abonnement bij My Summerbody Club',
        abonnementType: '3 maanden | Start Pakket | Per maand',
        abonnementTitle: 'Training & Coaching | 1,5 uur | 3 x week trainen | incl. vetmetingen',
        kosten: ['Pakket kosten: 3x € 945,00', 'Kosten per maand: € 945,00'],
        totalKosten: ['Kosten 1e maand', 'Daarna maandelijkse kosten: € 945,00'],
        extra: true,
        recurring:true,
    },
    {
        trainingTitle:'Wedstrijd Trainingen',
        amount: '1170.00',
        quantity: '6',
        title: 'p.m. | 6 maanden | Start Pakket | 4 x week trainen | incl.. vetmetingen',
        subTitle: 'Je Wedstrijd Training abonnement bij My Summerbody Club',
        abonnementType: '6 maanden | Start Pakket | Per maand',
        abonnementTitle: 'Training & Coaching | 1,5 uur | 4 x week trainen | incl. vetmetingen',
        kosten: ['Pakket kosten: 6x € 1.170,00', 'Kosten per maand: € 1.170,00'],
        totalKosten: ['Kosten 1e maand', 'Daarna maandelijkse kosten: € 1170,00'],
        extra: true,
        recurring:true,
    },
    {
        trainingTitle:'Wedstrijd Trainingen',
        amount: '800.00',
        quantity: '1',
        title: '| 10 Rittenkaart* | 1.5 uur | v.a. p.p.',
        subTitle: 'Je Wedstrijd Training abonnement bij My Summerbody Club',
        abonnementType: '10 Rittenkaart',
        abonnementTitle: 'Training & Coaching | 1,00/1,5 uur',
        kosten: ['Kosten:'],
        totalKosten: ['Totaal Kosten'],
        extra: false,
        recurring:false,
    },
    {
        trainingTitle:'Wedstrijd Trainingen',
        amount: '1500.00',
        quantity: '1',
        title: '| 20 Rittenkaart** | 1.5 uur | v.a. p.p.',
        subTitle: 'Je Wedstrijd Training abonnement bij My Summerbody Club',
        abonnementType: '20 Rittenkaart',
        abonnementTitle: 'Training & Coaching | 1,00 / 1,5 uur',
        kosten: ['Kosten:'],
        totalKosten: ['Kosten 1e maand', 'Daarna maandelijkse kosten: € 1500,00'],
        extra: true,
        recurring:false,
    },


];

export const extraOptions = [
    {
        amount: '300',
        title: '- per 3 maanden | Standaard | Vegan | 3 Metingen'
    },


];

export const clubAmount = [
    {
        amount: '15',
        title: 'Clubpas/ QR-code',
        status: true,
    }
];

export const wedstrijdTrainingDescription = [
    {
        title: 'Wedstrijd Training',
        quote: 'Wij ziijn hier om je te inspirenen, En willen dat je beter bent dan gisteren: Omdat je niet hebt opgegeven.',
        trainingFeatures: [
            'Wedstrijd is begeleiding op maat ',
            'Afgestemd op je fysieke gesteldheid',
            'Vermindering van rugklachten',
            '	Voedingsbegeleiding (Optioneel)',
        ],
        startingPrice: '€ 51,00',
        tenure: 'Vanaf p.u.',
        cardHeadline: 'Its Your Time To Shine',
        headLineBg: '#ff0004',
        featuredImage: PersonalImage,
        trainingLink: '/trainingprograms/wedstrijd-training/payment-form',
    }
];