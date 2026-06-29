import React from "react";
import StaticContentPage from "../../components/common/StaticContentPage";

export default function Huisregels() {
  return (
    <StaticContentPage title="Huisregels">
      <div className="static-content-prose">
        <section className="static-article">
          <h2 className="static-article__title">
            Als hier je 2<sup>e</sup> huis is, doe dan alsof je thuis bent
          </h2>
          <p>
            We vinden het belangrijk dat je in een sportieve en gezellige omgeving kan komen trainen. Om het
            bezoek aan onze clubs voor iedereen plezierig te maken en te houden, hebben we een aantal huisregels
            opgesteld:
          </p>
          <ul>
            <li>Samen houden we de club Train daarom op sportschoenen die je alleen binnen gebruikt;</li>
            <li>
              Omwille van hygiëne verzoeken we je een handdoek op het zit- en loungedeelte van het apparaat te
              leggen tijdens je training;
            </li>
            <li>Uitsluitend in onze gezellige social corner is eten toegestaan;</li>
            <li>Voorkom struikelsituaties door gewichten en dumbbells terug te leggen in de rekken;</li>
            <li>Het smijten met gewichten is niet toegestaan</li>
            <li>Je bent natuurlijk zuinig op je spullen, berg ze daarom veilig op in de kluisjes;</li>
            <li>
              Voor het gebruik van de sauna hebben wij een apart reglement, lees deze{" "}
              <a
                href="https://mysummerbodyclub.nl/saunareglement/"
                target="_blank"
                rel="noopener noreferrer"
              >
                hier
              </a>{" "}
              door;
            </li>
            <li>
              Deelname aan trainingen en gebruikmaking van onze apparatuur gebeurt geheel op eigen
              verantwoordelijkheid;
            </li>
          </ul>
          <p>
            <em>
              My Summerbody Club is niet aansprakelijk voor verlies, diefstal en ongevallen in en om het
              fitnesscentrum.
            </em>
          </p>
        </section>
      </div>
    </StaticContentPage>
  );
}
