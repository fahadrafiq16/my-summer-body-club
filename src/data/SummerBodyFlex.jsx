import Image from '../images/3.-FLEX-MSBC.jpg'

export const paymentOptions = [
 
    {
        trainingTitle:'Summerbody Flex',
        amount: '75.00',
        quantity: '3',
        title: 'Betalen per 4 weken',
        subTitle: 'Je maandelijks opzegbaar My Summerbody Flexy abonnement bij My Summerbody Club',
        abonnementType: 'per 4 weken',
        abonnementTitle: 'Actie: Geen',
        kosten: ['kosten:'],
        totalKosten: ['Totaal Kosten'],
        extra: false,
        recurring:true,
        programType:'club',
        clubExtraTitle:'Betaling per 4 weken via automatishe incasso',
    },

];

export const extraOptions = [
   
    {}
];

export const clubAmount = [
    {
        amount:'15',
        title:'Clubpas/ QR-code',
        status:true,
    }
];

export const summerBodyTrainingDescriptionFlex = [
    {
        title:'Summerbody Flex',
        quote:` "Wij ziijn hier om je te inspirenen, En willen dat je beter bent dan gisteren: 'Omdat je niet hebt opgegeven'."`,
        trainingFeatures:[
            'Geen inschrijfgeld (t.w.v. €29,99)',
            'Na 12 maanden maandelijks opzegbaar',
            '14 dagen bedenktijd',
            'Leden selectie',
        ],
        startingPrice:'€ 75,00',
        tenure:'Per 4 weken',
        cardHeadline:'Zorgeloos',
        headLineBg:'#7406e2',
        featuredImage: Image,
        trainingLink:'/trainingprograms/my-summerbody-flex/payment-form',
    }
];