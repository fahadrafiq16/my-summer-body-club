import Image from '../images/1-jarig.jpg'

export const paymentOptions = [
 
    {
        trainingTitle:'1-jarig My Summerbody Club',
        amount: '45.00',
        quantity: '3',
        title: 'Betalen per 4 weken',
        subTitle: 'Je 1-jarig My Summerbody Club abonnement bij My Summerbody Club',
        abonnementType: 'per 4 weken',
        abonnementTitle: 'Actie: 3 maanden gratis trainen',
        kosten: ['kosten:'],
        totalKosten: ['Totaal Kosten'],
        extra: false,
        recurring:true,
        programType:'club',
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

export const summerBodyTrainingDescription = [
    {
        title:'Summerbody 1 jarig',
        quote:'Wij ziijn hier om je te inspirenen, En willen dat je beter bent dan gisteren: Omdat je niet hebt opgegeven.',
        trainingFeatures:[
            'Geen inschrijfgeld (t.w.v. €29,99)',
            'Na 12 maanden maandelijks opzegbaar',
            '14 dagen bedenktijd',
            'Leden selectie',
        ],
        startingPrice:'€ 45,00',
        tenure:'Per 4 weken',
        cardHeadline:'Meest Gekozen',
        headLineBg:'#000000',
        featuredImage: Image,
        trainingLink:'/trainingprograms/my-summerbody-1-jaar/payment-form',
    }
];