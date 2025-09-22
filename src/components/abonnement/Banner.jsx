import React from "react";
import { useNavigate } from "react-router-dom";

const Banner = () => {

  const navigate = useNavigate();

  return (
    <>
      <div id="msbc_maak_je" className="pt-[100px]">
        <div className="container max-w-[1110px] mx-auto">
          <div className="msbc_ben_je_content_area">
            <div className="msbc_ben_je_left">
              <h3>
                Maak Je Lichaam Sterker, Blijf{" "}
                <span className="msbc_span">Fit</span> en{" "}
                <span className="msbc_span">Gezond </span>
              </h3>
              <p className="msbc_normal_p">
                We bieden een breed scala aan diensten aan om je fitnesservaring
                effectiever, flexibeler en creatiever te maken. Onze
                gekwalificeerde trainers zijn niet alleen goed uitgerust met
                kennis over fitness, gewichtsverlies, wedstrijdtrainingen en
                kickboksen, maar hebben zelf op hoog niveau deelgenomen aan
                wedstrijden in hun vakgebied. Door onze kennis kunnen wij
                trainingsprogramma’s aanbieden die allemaal zijn afgestemd op
                het doel en de wensen van de klant. Hieronder staan enkele
                diensten die wij aanbieden.
              </p>

              
              <button
                className="button-focused-proefles msbc_ben_button"
                onClick={() => navigate("/proefles")}
              >
                Start Je Training Vandaag!
              </button>
              <div className="msbc_ben_social-profiles">
                <a className="msbc_ben_item" href="#">
                  <i className="fab fa-instagram"></i>
                </a>

                <a className="msbc_ben_item" href="#">
                  <i className="fab fa-pinterest"></i>
                </a>

                <a className="msbc_ben_item" href="#">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
            <div className="msbc_ben_je_right">
              <img
                src="https://mysummerbodyclub.nl/wp-content/themes/my-summer-body-club/assets/Sterk_Fit_Gezond_-MSBC.jpg"
                alt="Men After"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;
