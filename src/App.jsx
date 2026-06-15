import React, { useState, useEffect } from 'react';
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import Services from './sections/Services';
import About from './sections/About';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import DetailedView from './sections/DetailedView';

// Data imports
import { companyInfo as staticCompanyInfo } from './data/companyInfo';
import { fallbackServices } from './data/services';
import { projectsData } from './data/projects';

function App() {
  const [currentView, setCurrentView] = useState({ page: 'home', id: null, type: null });
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [companyDetails, setCompanyDetails] = useState(staticCompanyInfo);

  // 1. Fetch Dynamic Customization Settings from Admin Dashboard (customization API)
  useEffect(() => {
    const fetchCustomizationData = async () => {
      try {
        const res = await fetch(`${staticCompanyInfo.apiBase}/customization`);
        if (!res.ok) throw new Error('Failed to fetch customization');
        const json = await res.json();
        const data = json.data || json;
        
        // Merge customization payload into companyDetails state
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

  // 2. Fetch Dynamic Services from Admin Dashboard (properties API)
  useEffect(() => {
    const fetchServicesList = async () => {
      try {
        // Fetch endpoint matching where the admin panel writes to (properties)
        // Public API exposing services is expected at /api/services
        const res = await fetch(`${staticCompanyInfo.apiBase}/api/services`);
        if (!res.ok) throw new Error('API error');
        const json = await res.json();
        const data = json.data || json;
        setServices(data);
      } catch (err) {
        console.warn('[API PREPARATION] Services API unavailable, loading fallback datasets.');
        setServices(fallbackServices);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServicesList();
  }, []);

  // 3. Navigation handlers
  const handleNavigateDetail = (id, type) => {
    setCurrentView({ page: 'detail', id, type });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = (targetSection = '') => {
    setCurrentView({ page: 'home', id: null, type: null });
    if (targetSection) {
      setTimeout(() => {
        const el = document.getElementById(targetSection);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
  };

  return (
    <div className="app">
      <Navbar onNavigateHome={() => handleNavigateHome()} currentView={currentView} onNavigateSection={handleNavigateHome} />
      
      {currentView.page === 'home' ? (
        <>
          <Hero companyDetails={companyDetails} />
          <Services 
            services={services} 
            loading={loadingServices} 
            onNavigateDetail={(id) => handleNavigateDetail(id, 'service')} 
          />
          <About companyDetails={companyDetails} />
          <Projects 
            projects={projectsData} 
            onNavigateDetail={(id) => handleNavigateDetail(id, 'project')} 
          />
          <Contact companyDetails={companyDetails} services={services} />
        </>
      ) : (
        <DetailedView 
          itemId={currentView.id} 
          itemType={currentView.type} 
          projects={projectsData}
          services={services}
          onBack={() => handleNavigateHome()}
          apiBase={companyDetails.apiBase}
        />
      )}
      
      <Footer companyDetails={companyDetails} />
    </div>
  );
}

export default App;
