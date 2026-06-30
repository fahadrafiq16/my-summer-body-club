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
import TestimonialUploader from './pages/testimonialsuploader/TestimonialUploader';
import AlgemeneVoorwaarden from './pages/static/AlgemeneVoorwaarden';
import PrivacyVerklaring from './pages/static/PrivacyVerklaring';
import Huisregels from './pages/static/Huisregels';
import Cookies from './pages/static/Cookies';
import HerroepingsRecht from './pages/static/HerroepingsRecht';
import Sepa from './pages/static/Sepa';
import Fotos from './pages/Fotos/Fotos';
import FotosGalleryDetail from './pages/Fotos/FotosGalleryDetail';

import AfvallenIntro from './pages/formsIntroduction/AfvallenIntro';
import PersonalIntro from './pages/formsIntroduction/PersonalIntro';
import GroepPTIntro from './pages/formsIntroduction/GroepPTIntro';
import WedstrijdIntro from './pages/formsIntroduction/WedstrijdIntro';

import Layout from './pages/dashboard/Layout';
import MainLayout from './layouts/MainLayout';
import DashboardHome from './pages/dashboard/Home';
import AllPayments from './pages/dashboard/AllPayments';
import PaymentDetails from './pages/dashboard/PaymentDetails';
import CustomersReviews from './pages/dashboard/CustomersReviews';
import RevenueDashboardMock from './pages/dashboard/my_summerbody_club (1)';
import TrainingPrograms from './pages/dashboard/TrainingPrograms';
import Login from './pages/auth/Login';
import DashboardDemo from './pages/dashboard-new/DashboardDemo';

import ScrollToTop from "react-scroll-to-top";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

import LandbotWidget from './components/common/LandbotWidget';
import MongoDbStatusIndicator from './components/common/MongoDbStatusIndicator';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {

  return (
    <AuthProvider>
      <Router>
        <div className="App">

          <MongoDbStatusIndicator />
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
              <Route path="/fotos" element={<Fotos />} />
              <Route path="/fotos/:slug" element={<FotosGalleryDetail />} />
              <Route path="/abonnement" element={<Abonnement />} />
              <Route path="/trainers" element={<Trainers />} />
              <Route path="/bootcamp" element={<Bootcamp />} />
              <Route path="/pt-ruimte-huren" element={<PtRent />} />
              <Route path="/contact" element={<ContactForm />} />
              <Route path="/testimonial-uploader" element={<TestimonialUploader />} />

              <Route path="/informatie" element={<Informatie />} />
              <Route path="/proefles" element={<Proefles />} />
              <Route path="/algemene-voorwaarden" element={<AlgemeneVoorwaarden />} />
              <Route path="/algemene-voorwaarden/" element={<AlgemeneVoorwaarden />} />
              <Route path="/privacyverklaring" element={<PrivacyVerklaring />} />
              <Route path="/privacyverklaring/" element={<PrivacyVerklaring />} />
              <Route path="/huisregels" element={<Huisregels />} />
              <Route path="/huisregels/" element={<Huisregels />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/cookies/" element={<Cookies />} />
              <Route path="/herroepings-recht" element={<HerroepingsRecht />} />
              <Route path="/herroepings-recht/" element={<HerroepingsRecht />} />
              <Route path="/sepa" element={<Sepa />} />
              <Route path="/sepa/" element={<Sepa />} />

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

            <Route path="/dashboard/login" element={<Login />} />
            <Route path="/dashboard-new/login" element={<Login />} />
            <Route
              path="/dashboard-new"
              element={
                <ProtectedRoute>
                  <DashboardDemo />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="payments" element={<AllPayments />} />
              <Route path="testimonials" element={<CustomersReviews />} />
              <Route path="charts" element={<RevenueDashboardMock />} />
              <Route path="training-programs" element={<TrainingPrograms />} />
              <Route path="payments/:id" element={<PaymentDetails />} />
            </Route>

          </Routes>

        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
