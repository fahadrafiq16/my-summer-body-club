import React, { useState } from 'react';

const PaymentBox = ({ selectedOption, extraOption, clubAmount }) => {
    console.log(clubAmount[0].amount);
    console.log('extra',extraOption);

    return (

        <div className="first-payment-radio">
            <p className="pp">Check of alles klopt en bevestig je abonnement. </p>
            <div className="active-details">
                <h4>Samenvatting ter controle</h4>
                <h4 className="bg">Actie: Geen inschrijfgeld</h4>
            </div>
            <p style={{ marginTop: '10px', fontSize: '16px' }} className="pp pg">
                {selectedOption.subTitle}
            </p>
            <div className="active-details">
                <p>Actie: Geen inschrijfgeld</p>
                <p>€ 24,99</p>
            </div>
            <div className="active-details">
                <p>
                    Abonnement type:<br />{selectedOption.abonnementTitle}
                </p>
                <p style={{ textAlign: 'right', lineHeight: '27px' }}>
                    <strong>{selectedOption.abonnementType}</strong>
                    <br />€ {selectedOption.amount}
                </p>
            </div>
            <h5><strong>Extra</strong></h5>
            <div className="active-details bottom-border">
                <p id="extra-name" className="extra-name">{selectedOption.extra ? extraOption.title : 'Geen'}</p>
                <p id="extra-value" className="extra-value">€ {selectedOption.extra ? extraOption.amount : 0}</p>
            </div>
            <div style={{ marginTop: '15px' }} className="active-details bottom-border">
                <div className="kosten">
                    {
                        selectedOption.kosten.map((item, index) => (
                            <p className="">{item}</p>
                        ))
                    }
                </div>
                <div className="pt-form-group pt-form-group-17 pt-form-group-total-amount">
                    Totaal: <span className="pt-total-amount">€ {selectedOption.amount * selectedOption.quantity},00</span>
                </div>
            </div>
            <p className="pg" style={{ marginTop: '15px' }}>
                Éénmalig kosten
            </p>
            <div className="active-details bottom-border">
                <p className="pp">Inschrijfgeld</p>
                <p className="pp align-left">€ 24,99</p>
            </div>

            {
                clubAmount[0].status && (
                    <div style={{ marginTop: '0.9rem' }} className="active-details bottom-border">
                        <p className="pp">Clubpas/ QR-code</p>
                        <p className="pp align-left">€ {clubAmount[0].amount},00</p>
                    </div>
                )
            }

            <div style={{ marginTop: '15px' }} className="active-details bottom-border">
                <p className="pp">Actie: Geen inschrijfgeld</p>
                <p className="pp align-left">€ 24,99</p>
            </div>
            <div style={{ marginTop: '15px' }} className="active-details bottom-border">

                <div className="kosten">
                    {
                        selectedOption.totalKosten.map((item, index) => (
                            <p className="pp pg totaal-kosten-area">{item}</p>
                        ))
                    }
                </div>



                <div className="pt-form-group pt-form-group-18 pt-form-group-total-amount">
                    Totaal: <span className="pt-total-amount">€ {(parseFloat(selectedOption.amount) + (selectedOption.extra ? parseFloat(extraOption.amount) : 0) + parseFloat(clubAmount[0].amount)).toFixed(2)}</span>
                </div>
            </div>
            <div style={{ marginTop: '15px' }} className="active-details bottom-border">
                <p className="pp pg">Nu te betalen</p>
                <div className="pt-form-group pt-form-group-19 pt-form-group-total-amount">
                    Totaal: <span className="pt-total-amount">€ {(parseFloat(selectedOption.amount) + (selectedOption.extra ? parseFloat(extraOption.amount) : 0) + parseFloat(clubAmount[0].amount)).toFixed(2)}</span>
                </div>
            </div>
        </div>

    );
};

export default PaymentBox;
