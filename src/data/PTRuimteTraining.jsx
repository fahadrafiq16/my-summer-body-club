// src/data/paymentData.js
import PersonalImage from '../images/groep-pt.png'
console.log(PersonalImage);

export const paymentOptions = [
    {
        trainingTitle:'PT Ruimte',
        amount: '332.75',
        quantity: '1',
        title: '| Per maand | Excl BTW',
        subTitle: 'Je Groep PT Training abonnement bij My Summerbody Club',
        abonnementType: 'Per maand',
        abonnementTitle: 'Training | 1 op 2 | Prijs p.p.',
        kosten: ['Kosten:'],
        totalKosten: ['Totaal'],
        extra: false,
        recurring:false,
    },
];

export const extraOptions = [
   
    {}
];

export const clubAmount = [
    {
        amount:'0',
        title:'Clubpas/ QR-code',
        status:false,
    }
];




export const ptRuimteTrainingDescription = [
    {
        title: 'Aanvraag verhuur PT ruimte',
        quote: 'Een groot bedrijf begint klein',
        trainingFeatures: [
            'Opstart eigen business',
            '6 dagen per week',
            'Geen hoge kosten',
            'PRofessionele apparatuur',
            'MSBC pas: €25,00',
            'Borg: € 100,00',
        ],
        startingPrice: '€ 250,00',
        tenure: 'Per 4 weken',
        cardHeadline: 'My BFF',
        headLineBg: '#d602dd',
        featuredImage: PersonalImage,
        trainingLink: '/trainingprograms/groeppt-training/payment-form',
        isRent:true,
    }
];