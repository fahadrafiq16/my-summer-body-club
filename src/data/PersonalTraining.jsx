// src/data/paymentData.js
import PersonalImage from '../images/personal-training.jpg'
console.log(PersonalImage);

export const paymentOptions = [
    {
        trainingTitle:'Personal Trainingen',
        amount: '65.00',
        quantity: '1',
        title: 'per uur | Training - 1 op 1',
        subTitle: 'Je Personal Training abonnement bij My Summerbody Club',
        abonnementType: 'Per uur',
        abonnementTitle: 'Training 1 op 1',
        kosten: ['Kosten:'],
        totalKosten: ['Totaal Kosten'],
        extra: false,
        recurring:false,
    },
    {
        trainingTitle:'Personal Trainingen',
        amount: '499.00',
        quantity: '3',
        title: 'p.m. | 3 maanden | Start Pakket | 2 x week trainen | incl.. vetmetingen | p.p.',
        subTitle: 'Je Personal Training abonnement bij My Summerbody Club',
        abonnementType: '3 maanden | Start Pakket | Per maand',
        abonnementTitle: '2x week trainen | incl. vetmetingen',
        kosten: ['Pakket kosten: 3 x € 499,00', 'Kosten per maand: € 499,00'],
        totalKosten: ['Kosten 1e maand', 'Daarna maandelijkse kosten: € 499,00'],
        extra: true,
        recurring:true,
    },
    {
        trainingTitle:'Personal Trainingen',
        amount: '540.00',
        quantity: '3',
        title: 'p.m. | 3 maanden | Start Pakket | 3 x week trainen | incl.. vetmetingen | p.p.',
        subTitle: 'Je Personal Training abonnement bij My Summerbody Club',
        abonnementType: '3 maanden | Start Pakket | Per maand',
        abonnementTitle: '3 x week trainen | incl. vetmetingen',
        kosten: ['Pakket kosten: 3 x € 540,00', 'Kosten per maand: € 540,00'],
        totalKosten: ['Kosten 1e maand', 'Daarna maandelijkse kosten: € 540,00'],
        extra: true,
        recurring:true,
    },
    {
        trainingTitle:'Personal Trainingen',
        amount: '399.00',
        quantity: '6',
        title: 'p.m. | 6 maanden | Start Pakket | 2 x week trainen | incl.. vetmetingen | p.p.',
        subTitle: 'Je Personal Training abonnement bij My Summerbody Club',
        abonnementType: '6 maanden | Start Pakket | Per maand',
        abonnementTitle: '2 x week trainen | incl. vetmetingen',
        kosten: [' Pakket kosten: 6 x € 399,00 ', 'Kosten per maand: € 399,00 '],
        totalKosten: ['Kosten 1e maand', 'Daarna maandelijkse kosten: € 399,00'],
        extra: true,
        recurring:true,
    },
    {
        trainingTitle:'Personal Trainingen',
        amount: '300.00',
        quantity: '1',
        title: '| 5 Rittenkaart *| p.p.',
        subTitle: 'Je Personal Training abonnement bij My Summerbody Club',
        abonnementType: '5 Rittenkaart',
        abonnementTitle: 'Training 1 op 1',
        kosten: ['Kosten:'],
        totalKosten: ['Totaal Kosten'],
        extra: false,
        recurring:false,
    },
    {
        trainingTitle:'Personal Trainingen',
        amount: '550.00',
        quantity: '1',
        title: '| 10 Rittenkaart** | p.p.',
        subTitle: 'Je Personal Training abonnement bij My Summerbody Club',
        abonnementType: '10 Rittenkaart',
        abonnementTitle: 'Training 1 op 1',
        kosten: ['Kosten:'],
        totalKosten: ['Totaal Kosten'],
        extra: false,
        recurring:false,
    },
    {
        trainingTitle:'Personal Trainingen',
        amount: '1020.00',
        quantity: '1',
        title: '| 20 Rittenkaart *** | p.p.',
        subTitle: 'Je Personal Training abonnement bij My Summerbody Club',
        abonnementType: '20 Rittenkaart',
        abonnementTitle: 'Training 1 op 1',
        kosten: ['Kosten:'],
        totalKosten: ['Totaal Kosten'],
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
        amount:'0',
        title:'Clubpas/ QR-code',
        status:false,
    }
];

export const trainingDescription = [
    {
        title:'Personal Training',
        quote:'Wij ziijn hier om je te inspirenen, En willen dat je beter bent dan gisteren: Omdat je niet hebt opgegeven.',
        trainingFeatures:[
            'Doel gerichte training op maat',
            '100% persoonlijke aandacht',
            'Tussentijdse voortgangsmetingen',
            'Voedingsschema op maat (Optioneel)',
        ],
        startingPrice:'€ 51,00',
        tenure:'Vanaf p.u.',
        cardHeadline:'My Summerbody',
        headLineBg:'#f04d17',
        featuredImage: PersonalImage,
        trainingLink:'/trainingprograms/personal-training/payment-form',
    }
];