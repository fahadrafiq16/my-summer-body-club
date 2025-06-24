// src/data/paymentData.js
import PersonalImage from '../images/personal-training.jpg'
console.log(PersonalImage);

export const paymentOptions = [
    {
        trainingTitle:'Bootcamp Trainingen',
        amount: '144.00',
        quantity: '1',
        title: 'per uur | Training - 1 op 1',
        subTitle: 'Je Bootcamp Training abonnement bij My Summerbody Club',
        abonnementType: 'Losse lessen',
        abonnementTitle: '12 Lessen | Prijs p.p',
        kosten: ['Kosten:'],
        totalKosten: ['Totaal Kosten'],
        extra: false,
        recurring:false,
    },
];

export const extraOptions = [
    
    
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
        title:'Bootcamp Training',
        quote:'Wij ziijn hier om je te inspirenen, En willen dat je beter bent dan gisteren: Omdat je niet hebt opgegeven.',
        trainingFeatures:[
            'Doel gerichte training op maat',
            '100% persoonlijke aandacht',
            'Tussentijdse voortgangsmetingen',
            'Voedingsschema op maat (Optioneel)',
        ],
        startingPrice:'€ 144,00',
        tenure:'Vanaf p.u.',
        cardHeadline:'My Summerbody',
        headLineBg:'#f04d17',
        featuredImage: PersonalImage,
        trainingLink:'/trainingprograms/personal-training/payment-form',
    }
];