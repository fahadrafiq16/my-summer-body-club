import React from "react";
import StaticContentPage from "../../components/common/StaticContentPage";

export default function Sepa() {
  return (
    <StaticContentPage title="SEPA">
      <div className="static-content-prose">
        <section className="static-article">
          <h2 className="static-article__title">SEPA</h2>
          <p>
            In het Nederlandse betalingsverkeer is hard gewerkt aan de overgang naar Europese standaarden die op
            grond van Europese wetgeving vanaf 1 februari 2014 verplicht is voor het betalingsverkeer in euro’s. In
            januari 2014 is er een voorstel gekomen van de Europese Commissie voor een aanvullende overgangsperiode
            van zes maanden omdat niet overal in de eurozone de migratie ver genoeg gevorderd is. Het Europees
            Parlement en de Raad hebben met dit voorstel ingestemd zodat marktpartijen nog tot 1 augustus 2014 met
            nationale standaarden en formaten kunnen werken.
          </p>
        </section>

        <section className="static-article">
          <h2 className="static-article__title">Waarom SEPA?</h2>
          <p>
            Europa is onderweg naar één grote betaalmarkt: de Single Euro Payments Area. Nationale verwerkers en
            aanbieders van betalingsverkeer zijn niet langer afgeschermd van buitenlandse concurrentie. Dat gaat de
            efficiency verhogen.
          </p>
          <p>
            Door op ‘bevestig’ te klikken geef je toestemming aan My Summerbody Club om doorlopende incasso-opdrachten
            te sturen naar je bank om een bedrag van je rekening af te schrijven en aan je bank om doorlopend een
            bedrag van je rekening af te schrijven overeenkomstig de opdracht van My Summerbody Club. Als je het niet
            eens bent met deze afschrijving kunt je deze laten terugboeken. Neem hiervoor binnen 8 weken na
            afschrijving contact op met je bank. Vraag je bank naar de voorwaarden.
          </p>
        </section>
      </div>
    </StaticContentPage>
  );
}
