import React, { useState } from 'react';

const RentPaymentBox = ({
    selectedOption,
    extraOption,
    clubAmount,

}) => {

    console.log('extra', selectedOption);

    return (

        <>

            <div className="first-payment-radio">
                <p className="pp">Check of alles klopt en bevestig je abonnement. </p>
                <div className="active-details">
                    <h4>Samenvatting ter controle</h4>
                    <h4 className="bg">Actie: Geen inschrijfgeld</h4>
                </div>
                <p style={{ marginTop: '10px', fontSize: '16px' }} className="pp pg">
                    Je 1-jarig PT Ruimte huurcontract bij My Summerbody Club.<br />
                    Na 12 maanden automatisch verlengen daar een doorlopende contract met een <br /> opzegtermijn van 2 maanden.
                </p>

                <div className="active-details">
                    <p>
                        Abonnement type:<br />
                    </p>
                    <p style={{ textAlign: 'right', lineHeight: '27px' }}>
                        <strong>Per maand</strong>
                        <br />€ {selectedOption.amount}
                    </p>
                </div>
                <h5><strong>Kosten</strong></h5>

                <div style={{ marginTop: '15px' }} className="active-details bottom-border">
                    <div className="kosten">
                        Huur
                    </div>
                    <div className="pt-form-group pt-form-group-17 pt-form-group-total-amount">
                        <span className="pt-total-amount">€ {selectedOption.amount * selectedOption.quantity},00</span>
                    </div>
                </div>
                <p className="pg" style={{ marginTop: '15px' }}>
                    Éénmalig kosten
                </p>
                <div className="active-details bottom-border">
                    <p className="pp">Toegangspas</p>
                    <p className="pp align-left">€ 25,00</p>
                </div>

                <div className="mt-4 active-details bottom-border">
                    <p className="pp"><strong>Borg</strong> (te betalen bij halen je toegangspas):</p>
                    <p className="pp align-left">€ 100,00</p>
                </div>

                <h5><strong>Subtotaal:</strong></h5>

                <div style={{ marginTop: '15px' }} className="active-details bottom-border">
                    <p className="pp">Huur per maand:</p>
                    <p className="pp align-left">€ 250,00</p>
                </div>

                <div style={{ marginTop: '15px' }} className="active-details bottom-border">
                    <p className="pp">Toegangspas:</p>
                    <p className="pp align-left">€ 25,00</p>
                </div>

                <div style={{ marginTop: '15px' }} className="active-details bottom-border">
                    <p className="pp">21% btw:</p>
                    <p className="pp align-left">€ 57,75</p>
                </div>

                <div style={{ marginTop: '15px' }} className="active-details bottom-border">

                   <p class="pp pg">Totaal</p>



                    <div className="pt-form-group pt-form-group-18 pt-form-group-total-amount">
                        <span className="pt-total-amount">€ 332,75</span>
                    </div>
                </div>
                <div style={{ marginTop: '15px' }} className="active-details bottom-border">
                    <p className="pp pg">Nu te betalen</p>
                    <div className="pt-form-group pt-form-group-19 pt-form-group-total-amount">
                        Totaal: € 332,75
                    </div>
                </div>
            </div>




        </>

    );
};

export default RentPaymentBox;
