import './App.css';
import PersonalTraining from './pages/paymentForms/PersonalTraining';
import AfvallenTraining from './pages/paymentForms/AfvallenTraining';
import WedstrijdTraining from './pages/paymentForms/wedstrijdTraining';
import GroepPTTraining from './pages/paymentForms/GroepPT';
import SummerBody1Jarig from './pages/paymentForms/Summerbody1jarig'
import PTRuimteForm from './pages/paymentForms/PTRuimteForm';
import BootcampForm from './pages/paymentForms/BootcampTraining';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home'
import Abonnement from './pages/abonnement/Abonnement';
import Footer from './components/header/Footer';
import ScrollToTop from './components/common/ScrollToTop';

import MollieRedirect from './pages/MollieRedirect/MollieRedirect';
import RecurringRedirect from './pages/MollieRedirect/RecurringRedirect';
import Header from './components/header/Header';
import OverMSBC from './pages/OverMSBC/OverMSBC';
import Trainers from './pages/trainers/Trainers';
import Bootcamp from './pages/bootcamp/Bootcamp';

import AfvallenIntro from './pages/formsIntroduction/AfvallenIntro';
import PersonalIntro from './pages/formsIntroduction/PersonalIntro';
import GroepPTIntro from './pages/formsIntroduction/GroepPTIntro';
import WedstrijdIntro from './pages/formsIntroduction/WedstrijdIntro';

import Layout from './pages/dashboard/Layout';
import MainLayout from './layouts/MainLayout';
import DashboardHome from './pages/dashboard/Home';
import AllPayments from './pages/dashboard/AllPayments';
import PaymentDetails from './pages/dashboard/PaymentDetails';

function App() {

  return (
    <Router>
      <div className="App">

        <ScrollToTop />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/over-msbc" element={<OverMSBC />} />
            <Route path="/abonnement" element={<Abonnement />} />
            <Route path="/trainers" element={<Trainers />} />
            <Route path="/bootcamp" element={<Bootcamp />} />

            <Route path="/trainingprograms/afvallen-training" element={<AfvallenIntro />} />
            <Route path="/trainingprograms/personal-training" element={<PersonalIntro />} />
            <Route path="/trainingprograms/groeppt-training/" element={<GroepPTIntro />} />
            <Route path="/trainingprograms/wedstrijd-training/" element={<WedstrijdIntro />} />
            

            <Route path="/trainingprograms/my-summerbody-1-jaar/payment-form" element={<SummerBody1Jarig />} />
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
