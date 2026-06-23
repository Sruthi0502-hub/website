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
import { projectsData } from './data/projects';

const defaultCompanyDetails = {
  name: "RRventures",
  tagline: "Structural Fabrication Works",
  heroSlogan: "Built to carry the hardest loads.",
  heroDescription: "RRventures specializes in heavy vehicle body fabrication, tankers, trailers, and custom industrial structures — engineered to perform.",
  phone: "+91 00000 00000",
  email: "info@rrventures.com",
  address: "RRventures Fabrication Yard",
  apiBase: "http://localhost:3000",
  stats: [
    { label: "Service Types", value: "10+" },
    { label: "Units Delivered", value: "500+" },
    { label: "Years Experience", value: "15+" }
  ],
  socials: {
    facebook: "#",
    twitter: "#",
    linkedin: "#",
    instagram: "#"
  }
};

export const API_BASE_URL = "http://localhost:3000";

// Home Page Layout Component
const HomeLayout = ({ companyDetails, services, loadingServices, projects, loadingProjects }) => {
  const navigate = useNavigate();
  return (
    <>
      <Hero companyDetails={companyDetails} />
      <Services 
        onNavigateDetail={(id) => navigate(`/services/${id}`)} 
      />
      <About companyDetails={companyDetails} />
      <Projects 
        projects={projects} 
        loading={loadingProjects}
        onNavigateDetail={(id) => navigate(`/projects/${id}`)} 
      />
      <Contact companyDetails={companyDetails} services={services} />
    </>
  );
};

// Route wrapper for Project Details
const ProjectDetailRoute = ({ projects, services, companyDetails }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <DetailedView 
      itemId={id} 
      itemType="project" 
      projects={projects}
      services={services}
      onBack={() => navigate('/')}
      apiBase={companyDetails.apiBase}
    />
  );
};

function App() {
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [companyDetails, setCompanyDetails] = useState(defaultCompanyDetails);
  
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Fetch Dynamic Customization Settings from Admin Dashboard (customization API)
  useEffect(() => {
    const fetchCustomizationData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/customization`);
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
        const res = await fetch(`${API_BASE_URL}/provideservices/public`);
        if (!res.ok) throw new Error('API error');
        const json = await res.json();
        const data = json.data || json;
        const normalizedData = data.map(s => {
          let imagePath = '';
          if (s.images) {
            const firstImage = Array.isArray(s.images) ? s.images[0] : s.images;
            imagePath = `${API_BASE_URL}/uploads/${firstImage}`;
          } else {
            imagePath = s.image || '';
          }
          return {
            ...s,
            image: imagePath
          };
        });
        setServices(normalizedData);
      } catch (err) {
        console.warn('[API PREPARATION] Services API unavailable.', err);
        setServices([]);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServicesList();
  }, []);

  // 3. Fetch Dynamic Projects from Admin Dashboard
  useEffect(() => {
    const fetchProjectsList = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/projects/public`);
        if (!res.ok) throw new Error('API error');
        const json = await res.json();
        const data = json.data || json;
        const normalizedData = data.map(p => {
          let imagePath = '';
          if (p.image) {
            imagePath = p.image.startsWith('http') ? p.image : `${API_BASE_URL}/uploads/${p.image}`;
          } else {
            imagePath = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80';
          }
          const galleryPaths = p.gallery 
            ? p.gallery.map(img => img.startsWith('http') ? img : `${API_BASE_URL}/uploads/${img}`)
            : [imagePath];

          // Specifications parsing safely
          let specs = p.specifications;
          if (specs && typeof specs === 'string') {
            try {
              specs = JSON.parse(specs);
            } catch (e) {
              specs = {};
            }
          }

          return {
            ...p,
            id: p._id || p.id,
            image: imagePath,
            gallery: galleryPaths,
            features: p.category || 'Fabrication',
            specifications: specs || {}
          };
        });
        setProjects(normalizedData);
      } catch (err) {
        console.warn('[API PREPARATION] Projects API unavailable. Using fallback projects data.');
        const normalizedFallback = projectsData.map(p => ({
          ...p,
          id: p._id || p.id || p.id,
          features: p.category || 'Fabrication'
        }));
        setProjects(normalizedFallback);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjectsList();
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
            projects={projects}
            loadingProjects={loadingProjects}
          />
        } />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/projects/:id" element={
          <ProjectDetailRoute 
            projects={projects}
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
