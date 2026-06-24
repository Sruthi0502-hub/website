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

// 🔴 LOCAL DATA REMOVED: Ab local fallback data ki zaroorat nahi hai.

const defaultCompanyDetails = {
  name: "RRventures",
  tagline: "Structural Fabrication Works",
  heroSlogan: "Built to carry the hardest loads.",
  heroDescription: "Loading content...", // Dynamic placeholder
  phone: "",
  email: "",
  address: "",
  stats: []
};

export const API_BASE_URL = "https://dashboard-management-u6vj.onrender.com";

// Home Page Layout Component
const HomeLayout = ({ companyDetails, services, loadingServices, projects, loadingProjects }) => {
  const navigate = useNavigate();
  return (
    <>
      <Hero companyDetails={companyDetails} />

      {/* 🟢 FIXED: Services data aur loading state ko pass kiya */}
      <Services
        services={services}
        loading={loadingServices}
        onNavigateDetail={(id) => navigate(`/services/${id}`)}
      />

      <About companyDetails={companyDetails} />

      {/* 🟢 FIXED: Projects data aur loading state pass kiya */}
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
      apiBase={API_BASE_URL}
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

  // 1. Fetch Dynamic Customization Settings
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
        console.error('Customization fetch error:', err);
      }
    };

    fetchCustomizationData();
  }, []);

  // 2. Fetch Dynamic Services
  // 🟢 App.jsx के अंदर Services फ़ेच करने वाला हिस्सा
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
            // अगर एरे है तो पहली इमेज लो, नहीं तो स्ट्रिंग को सीधे इस्तेमाल करो
            const firstImage = Array.isArray(s.images) ? s.images[0] : s.images;

            if (firstImage.startsWith('http://') || firstImage.startsWith('https://')) {
              imagePath = firstImage;
            } else {
              // 🛠️ डबल स्लैश // से बचाने के लिए क्लीनअप सेफ्टी रूल
              const cleanPath = firstImage.startsWith('/') ? firstImage.slice(1) : firstImage;
              const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
              imagePath = `${baseUrl}/uploads/${cleanPath}`;
            }
          }

          return {
            ...s,
            _id: s._id || s.id,
            images: imagePath // अब इसमें हमेशा एक साफ़ सुथरा फुल URL रहेगा
          };
        });

        setServices(normalizedData);
      } catch (err) {
        console.error('Services fetch error:', err);
        setServices([]);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServicesList();
  }, []);


  // 3. Fetch Dynamic Projects
  useEffect(() => {
    const fetchProjectsList = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/projects/public`);
        if (!res.ok) throw new Error('API error');
        const json = await res.json();
        const data = json.data || json;

        // URL को सुरक्षित रखने के लिए हेल्पर फंक्शन (डबल स्लैश // से बचाने के लिए)
        const cleanImageUrl = (path) => {
          if (!path) return '';
          if (path.startsWith('http://') || path.startsWith('https://')) return path;

          const cleanPath = path.startsWith('/') ? path.slice(1) : path;
          const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;

          return `${baseUrl}/uploads/${cleanPath}`;
        };

        const normalizedData = data.map(p => {
          // अगर p.image है तो URL बनेगा, नहीं तो खाली स्ट्रिंग ('') रहेगी
          const imagePath = p.image ? cleanImageUrl(p.image) : '';

          // गैलरी एरे को सेफली हैंडल करना (अगर स्ट्रिंग आए तो पार्स करना)
          let rawGallery = p.gallery;
          if (rawGallery && typeof rawGallery === 'string') {
            try { rawGallery = JSON.parse(rawGallery); } catch (e) { rawGallery = []; }
          }

          // अगर गैलरी में इमेजेस हैं तो उनका URL बनाएं, नहीं तो खाली एरे [] रखें
          const galleryPaths = Array.isArray(rawGallery) && rawGallery.length > 0
            ? rawGallery.map(img => cleanImageUrl(img))
            : (imagePath ? [imagePath] : []); // अगर गैलरी खाली है पर मुख्य इमेज है, तो उसे डालें

          // स्पेसिफिकेशन्स पार्स करना
          let specs = p.specifications;
          if (specs && typeof specs === 'string') {
            try { specs = JSON.parse(specs); } catch (e) { specs = {}; }
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
        console.error('Projects fetch error:', err);
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjectsList();
  }, []);

  useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollTo) {
      const sectionId = location.state.scrollTo;
      window.history.replaceState({}, document.title);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, [location]);

  const currentView = location.pathname === '/' ? { page: 'home' } : { page: 'detail' };

  return (
    <div className="app">
      <Navbar
        onNavigateHome={() => navigate('/')}
        currentView={currentView}
        onNavigateSection={(sectionId) => navigate('/', { state: { scrollTo: sectionId } })}
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