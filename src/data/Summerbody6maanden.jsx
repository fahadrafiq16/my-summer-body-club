import Image from '../images/6-maanden.png'

export const paymentOptions = [
 
    {
        trainingTitle:'Summerbody 6 maanden',
        amount: '75.00',
        quantity: '3',
        title: 'Betalen per 4 weken',
        subTitle: 'Je 6 maanden My Summerbody Club abonnement bij My Summerbody Club',
        abonnementType: 'per 4 weken',
        abonnementTitle: 'Actie: 3 maanden gratis trainen',
        kosten: ['kosten:'],
        totalKosten: ['Totaal Kosten'],
        extra: false,
        recurring:true,
        programType:'club',
        clubExtraTitle: 'Betaling per 4 weken voor 6 maanden via automatishe incasso',
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

export const summerBodyTrainingDescription6Maanden = [
    {
        title:'Summerbody 6 maanden',
        quote:`"Wij ziijn hier om je te inspirenen, En willen dat je beter bent dan gisteren: 'Omdat je niet hebt opgegeven'."`,
        trainingFeatures:[
            'Geen inschrijfgeld (t.w.v. €29,99)',
            'Na 12 maanden maandelijks opzegbaar',
            '14 dagen bedenktijd',
            'Leden selectie',
        ],
        startingPrice:'€ 75,00',
        tenure:'Per 4 weken',
        cardHeadline:'Populaire',
        headLineBg:'#49edd7',
        featuredImage: Image,
        trainingLink:'/trainingprograms/my-summerbody-6-maanden/payment-form',
    }
];