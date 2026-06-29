import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import TitleHeader from '../../components/common/TitleHeader'
import PtRentHeroImg from '../../images/groep-pt.png'
import { usePageHeroImage } from '../../hooks/usePageHeroImage'
import './PtRent.css'

const SECTION_KEY = 'pt-rent-page'

const checklistItems = [
  'Eigen baas',
  'Lage kosten',
  'Top apparatuur',
  '24/7 open',
]

const PtRent = () => {
  const heroImageUrl = usePageHeroImage(SECTION_KEY)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <TitleHeader title="PT Ruimte Huren" />

      <section className="pt-rent-page">
        <div className="pt-rent-container">
          <h2 className="pt-rent-headline">
            JOUW DROOM. JOUW BUSINESS. JOUW REGELS.
          </h2>

          <img
            className="pt-rent-hero-img"
            src={heroImageUrl || PtRentHeroImg}
            alt="My Summerbody Club gym"
          />

          <div className="pt-rent-intro">
            <p>
              Bij MY SUMMERBODY CLUB krijg je de ruimte om je naam als Personal Trainer op te bouwen.
              Train in een professionele omgeving.
            </p>
            <p>
              Geen hoge kosten. Geen grote investeringen. Alleen jouw passie en jouw klanten.
            </p>
          </div>

          <ul className="pt-rent-checklist">
            {checklistItems.map((item) => (
              <li key={item}>
                <i className="fas fa-check" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>

          <h3 className="pt-rent-cta-headline">
            STOP MET WACHTEN. START MET BOUWEN.
          </h3>

          <div className="pt-rent-cta-wrap">
            <Link
              to="/trainingprograms/pt-ruimte-training/payment-form"
              className="pt-rent-cta-btn"
            >
              Wordt vandaag je eigen baas
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default PtRent
