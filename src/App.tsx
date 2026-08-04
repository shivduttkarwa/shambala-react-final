import "./styles/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header, Footer } from "./components/Layout";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ServicePage from "./pages/ServicePage";

import NewContact from "./pages/NewContact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import CookiesPolicy from "./pages/CookiesPolicy";
import ScrollToTop from "./components/UI/ScrollToTop";
import Preloader from "./components/UI/Preloader";
import FloatingContact from "./components/UI/FloatingContact";

function App() {
  return (
    <>
      <Preloader />
      <Router basename={import.meta.env.BASE_URL}>
        <ScrollToTop />
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/services" element={<ServicePage />} />
              <Route
                path="/projects/:projectId"
                element={<ProjectDetailPage />}
              />
              <Route path="/contact-us" element={<NewContact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/cookies-policy" element={<CookiesPolicy />} />
              <Route
                path="/terms-and-conditions"
                element={<TermsAndConditions />}
              />
            </Routes>
          </main>
          <Footer />
          <FloatingContact />
        </div>
      </Router>
    </>
  );
}

export default App;
