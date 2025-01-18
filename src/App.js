import './App.css';
import PersonalTraining from './pages/paymentForms/PersonalTraining';
import AfvallenTraining from './pages/paymentForms/AfvallenTraining';
import WedstrijdTraining from './pages/paymentForms/wedstrijdTraining';
import GroepPTTraining from './pages/paymentForms/GroepPT';
import SummerBody1Jarig from './pages/paymentForms/Summerbody1jarig'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home'
import Abonnement from './pages/abonnement/Abonnement';

import MollieRedirect from './pages/MollieRedirect/MollieRedirect';
import RecurringRedirect from './pages/MollieRedirect/RecurringRedirect';
import Header from './components/header/Header';
import OverMSBC from './pages/OverMSBC/OverMSBC';
import Trainers from './pages/trainers/Trainers';

function App() {

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/over-msbc" element={<OverMSBC />} />
          <Route path="/abonnement" element={<Abonnement />} />
          <Route path="/trainers" element={<Trainers />} />

          <Route path="/trainingprograms/my-summerbody-1-jaar/payment-form" element={<SummerBody1Jarig />} />

          <Route path="/trainingprograms/personal-training/payment-form" element={<PersonalTraining />} />
          <Route path="/trainingprograms/afvallen-training/payment-form" element={<AfvallenTraining />} />
          <Route path="/trainingprograms/wedstrijd-training/payment-form" element={<WedstrijdTraining />} />
          <Route path="/trainingprograms/groeppt-training/payment-form" element={<GroepPTTraining />} />
          <Route path="/mollie-redirect" element={<MollieRedirect />} />
          <Route path="/recurring-redirect" element={<RecurringRedirect />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
