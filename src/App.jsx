import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import Services from './sections/Services';
import About from './sections/About';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import DetailedView from './sections/DetailedView';
import ServiceDetail from './sections/ServiceDetail';

// Data imports
import { companyInfo as staticCompanyInfo } from './data/companyInfo';
import { fallbackServices } from './data/services';
import { projectsData } from './data/projects';

// Home Page Layout Component
const HomeLayout = ({ companyDetails, services, loadingServices }) => {
  const navigate = useNavigate();
  return (
    <>
      <Hero companyDetails={companyDetails} />
      <Services 
        services={services} 
        loading={loadingServices} 
        onNavigateDetail={(id) => navigate(`/services/${id}`)} 
      />
      <About companyDetails={companyDetails} />
      <Projects 
        projects={projectsData} 
        onNavigateDetail={(id) => navigate(`/projects/${id}`)} 
      />
      <Contact companyDetails={companyDetails} services={services} />
    </>
  );
};

// Route wrapper for Project Details
const ProjectDetailRoute = ({ services, companyDetails }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <DetailedView 
      itemId={id} 
      itemType="project" 
      projects={projectsData}
      services={services}
      onBack={() => navigate('/')}
      apiBase={companyDetails.apiBase}
    />
  );
};

function App() {
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [companyDetails, setCompanyDetails] = useState(staticCompanyInfo);
  
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Fetch Dynamic Customization Settings from Admin Dashboard (customization API)
  useEffect(() => {
    const fetchCustomizationData = async () => {
      try {
        const res = await fetch(`${staticCompanyInfo.apiBase}/customization`);
        if (!res.ok) throw new Error('Failed to fetch customization');
        const json = await res.json();
        const data = json.data || json;
        
        setCompanyDetails(prev => ({
          ...prev,
          name: data.companyName || prev.name,
          email: data.companyEmail || prev.email,
          heroDescription: data.companyDescription || prev.heroDescription,
          phone: data.contactPhone || prev.phone,
          address: data.contactAddress || prev.address,
          footerText: data.footerText || `© ${new Date().getFullYear()} ${data.companyName || prev.name}. All rights reserved.`
        }));
      } catch (err) {
        console.warn('[API PREPARATION] Customization API unavailable, using local configurations.');
      }
    };

    fetchCustomizationData();
  }, []);

  // 2. Fetch Dynamic Services from Admin Dashboard
  useEffect(() => {
    const fetchServicesList = async () => {
      try {
        const res = await fetch('http://localhost:3000/provideservices/public');
        if (!res.ok) throw new Error('API error');
        const json = await res.json();
        const data = json.data || json;
        const normalizedData = data.map(s => ({
          ...s,
          image: s.images ? `http://localhost:3000/uploads/${s.images}` : (s.image || '')
        }));
        setServices(normalizedData);
      } catch (err) {
        console.warn('[API PREPARATION] Services API unavailable, loading fallback datasets.');
        setServices(fallbackServices);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServicesList();
  }, []);

  // 3. Scroll to section when returning to Home Page via navigation state
  useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollTo) {
      const sectionId = location.state.scrollTo;
      // Clear location state to prevent rescrolling on page reload/navigation
      window.history.replaceState({}, document.title);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  }, [location]);

  // Determine view state for navigation highlighting/handling
  const currentView = location.pathname === '/' ? { page: 'home' } : { page: 'detail' };

  return (
    <div className="app">
      <Navbar 
        onNavigateHome={() => navigate('/')} 
        currentView={currentView} 
        onNavigateSection={(sectionId) => {
          navigate('/', { state: { scrollTo: sectionId } });
        }} 
      />
      
      <Routes>
        <Route path="/" element={
          <HomeLayout 
            companyDetails={companyDetails} 
            services={services} 
            loadingServices={loadingServices} 
          />
        } />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/projects/:id" element={
          <ProjectDetailRoute 
            services={services} 
            companyDetails={companyDetails} 
          />
        } />
      </Routes>
      
      <Footer companyDetails={companyDetails} />
    </div>
  );
}

export default App;
