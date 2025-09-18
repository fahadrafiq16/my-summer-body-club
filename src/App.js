import './App.css';
import PersonalTraining from './pages/paymentForms/PersonalTraining';
import AfvallenTraining from './pages/paymentForms/AfvallenTraining';
import WedstrijdTraining from './pages/paymentForms/wedstrijdTraining';
import GroepPTTraining from './pages/paymentForms/GroepPT';

import SummerBody1Jarig from './pages/paymentForms/Summerbody1jarig'
import SummerBody6Maanden from './pages/paymentForms/Summerbody6maanden'
import SummerBodyFlex from './pages/paymentForms/SummerBodyFlex'

import PTRuimteForm from './pages/paymentForms/PTRuimteForm';
import BootcampForm from './pages/paymentForms/BootcampTraining';
import PtRent from './pages/PtRent/PtRent';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home'
import Abonnement from './pages/abonnement/Abonnement';
import Footer from './components/header/Footer';
import ScrollToTop1 from './components/common/ScrollToTop';

import MollieRedirect from './pages/MollieRedirect/MollieRedirect';
import RecurringRedirect from './pages/MollieRedirect/RecurringRedirect';
import Header from './components/header/Header';
import OverMSBC from './pages/OverMSBC/OverMSBC';
import Trainers from './pages/trainers/Trainers';
import Bootcamp from './pages/bootcamp/Bootcamp';
import ContactForm from './pages/contactform/ContactForm';
import Informatie from './pages/informatie/Informatie';
import Proefles from './pages/proefles/Proefles';

import AfvallenIntro from './pages/formsIntroduction/AfvallenIntro';
import PersonalIntro from './pages/formsIntroduction/PersonalIntro';
import GroepPTIntro from './pages/formsIntroduction/GroepPTIntro';
import WedstrijdIntro from './pages/formsIntroduction/WedstrijdIntro';

import Layout from './pages/dashboard/Layout';
import MainLayout from './layouts/MainLayout';
import DashboardHome from './pages/dashboard/Home';
import AllPayments from './pages/dashboard/AllPayments';
import PaymentDetails from './pages/dashboard/PaymentDetails';

import ScrollToTop from "react-scroll-to-top";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

import LandbotWidget from './components/common/LandbotWidget';

function App() {

  return (
    <Router>
      <div className="App">

        <LandbotWidget />
        <ScrollToTop
          smooth
          component={<FontAwesomeIcon icon={faArrowUp} size="lg" />}
          style={{
            borderRadius: "50%",
            backgroundColor: "#f44e17",
            bottom: "80px",
            color: "#fff",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
          }}
        />

        <ScrollToTop1 />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/over-msbc" element={<OverMSBC />} />
            <Route path="/abonnement" element={<Abonnement />} />
            <Route path="/trainers" element={<Trainers />} />
            <Route path="/bootcamp" element={<Bootcamp />} />
            <Route path="/pt-ruimte-huren" element={<PtRent />} />
            <Route path="/contact" element={<ContactForm />} />

            <Route path="/informatie" element={<Informatie />} />
            <Route path="/proefles" element={<Proefles />} />

            <Route path="/trainingprograms/afvallen-training" element={<AfvallenIntro />} />
            <Route path="/trainingprograms/personal-training" element={<PersonalIntro />} />
            <Route path="/trainingprograms/groeppt-training/" element={<GroepPTIntro />} />
            <Route path="/trainingprograms/wedstrijd-training/" element={<WedstrijdIntro />} />


            <Route path="/trainingprograms/my-summerbody-1-jaar/payment-form" element={<SummerBody1Jarig />} />
            <Route path="/trainingprograms/my-summerbody-6-maanden/payment-form" element={<SummerBody6Maanden />} />
            <Route path="/trainingprograms/my-summerbody-flex/payment-form" element={<SummerBodyFlex />} />
            <Route path="/trainingprograms/personal-training/payment-form" element={<PersonalTraining />} />
            <Route path="/trainingprograms/afvallen-training/payment-form" element={<AfvallenTraining />} />
            <Route path="/trainingprograms/wedstrijd-training/payment-form" element={<WedstrijdTraining />} />
            <Route path="/trainingprograms/groeppt-training/payment-form" element={<GroepPTTraining />} />
            <Route path="/trainingprograms/pt-ruimte-training/payment-form" element={<PTRuimteForm />} />
            <Route path="/trainingprograms/bootcamp-training/payment-form" element={<BootcampForm />} />

            <Route path="/mollie-redirect" element={<MollieRedirect />} />
            <Route path="/recurring-redirect" element={<RecurringRedirect />} />
          </Route>

          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<DashboardHome />} />
            <Route path="/dashboard/payments" element={<AllPayments />} />
            <Route path="/dashboard/payments/:id" element={<PaymentDetails />} />
          </Route>

        </Routes>

      </div>
    </Router>
  );
}

export default App;
