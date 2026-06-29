import React from "react";
import StaticContentPage from "../../components/common/StaticContentPage";

export default function HerroepingsRecht() {
  return (
    <StaticContentPage title="Herroepingsrecht">
      <div className="static-content-prose">
        <section className="static-article">
          <p>
            Wanneer je jouw lidmaatschap op onze website hebt afgesloten dan heb je altijd 14 dagen lang het recht om
            je lidmaatschap te herroepen. Als je het lidmaatschap niet gebruikt hebt in die periode, dan is deze
            herroeping kosteloos.
          </p>
          <p>
            Als je het lidmaatschap wel gebruikt hebt in deze periode, dan kan My Summerbody Club naar rato (vanaf de
            activering van je lidmaatschap tot de dag van de herroeping, inclusief het eventuele inschrijfgeld)
            kosten voor het lidmaatschap in rekening brengen.
          </p>
          <p>
            <strong>14 DAGEN HERROEPINGSRECHT</strong>
          </p>
          <p>
            Je kunt het lidmaatschap herroepen door het{" "}
            <strong>
              <a
                href="https://mysummerbodyclub.nl/wp-content/uploads/2022/09/MSBC-herroepingformulier.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                modelformulier
              </a>
            </strong>{" "}
            voor ontbinding in te vullen en naar ons te mailen (service@mysummerbodyclub.nl) of dit ingevulde
            formulier op te sturen (My Summerbody Club | Schoutstraat 21 | 1315 EV | Almere – Stad).
          </p>
        </section>

        <section className="static-article">
          <h2 className="static-article__title">
            Binnen de bedenktijd van 14 dagen van de overeenkomst die online of telefonisch tot stand is gekomen.
          </h2>
          <p>
            <strong>Dit formulier alleen invullen en terugzenden als je de overeenkomst wil herroepen.</strong>
          </p>
          <p>
            <strong>
              Ik laat My Summerbody Club hierbij weten dat ik mijn overeenkomst betreffende het lidmaatschap bij My
              Summerbody Club wil herroepen (ontbinden) binnen de 14 dagen bedenktijd.
            </strong>
          </p>
        </section>
      </div>
    </StaticContentPage>
  );
}
