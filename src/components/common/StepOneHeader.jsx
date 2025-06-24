import React from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faQuoteLeft, faCoffee } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

library.add(faQuoteLeft, faCoffee);

const StepOneHeader = ({ trainingDescription }) => {
    return (
        <>
            <div className="payment-form-title-area">
                <h3 className="payment-form-title-top">INSCHRIJFFORMULIER</h3>
                <h3 className="training-title">{trainingDescription[0].title}</h3>
                <p></p>
            </div>
            <div className="fact">
                <div className="landing-icon">
                    <FontAwesomeIcon icon="quote-left" size="2x" />
                </div>
                <p></p>
                <p>
                    "{trainingDescription[0].quote}"
                </p>
            </div>
            <h3 className="form-h3 step-form-none">Ik meld me aan voor:</h3>
            <p className="lead my-4 step-form-none">{trainingDescription[0].title}</p>
            <div className="training-features step-form-none">
                {
                    trainingDescription[0].trainingFeatures.map((feature) => (
                        <p>{feature}</p>
                    ))
                }

            </div>
        </>
    );
};

export default StepOneHeader;
