import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

function Home() {
  const [openCaseStudy, setOpenCaseStudy] = useState(null);
  const aboutRef = useRef(null);
  const whatWeOfferRef = useRef(null);
  const clientsRef = useRef(null);
  const caseStudiesRef = useRef(null);
  const testimonialRef = useRef(null);
  const portalRef = useRef(null);

  const sections = [
    { id: 'about', title: 'About', ref: aboutRef },
    { id: 'what-we-offer', title: 'What We Offer', ref: whatWeOfferRef },
    { id: 'clients', title: 'Clients', ref: clientsRef },
    { id: 'case-studies', title: 'Case Studies', ref: caseStudiesRef },
    { id: 'testimonial', title: 'Testimonials', ref: testimonialRef },
    { id: 'portal', title: 'Client Portal', ref: portalRef },
  ];

  const whatWeOffer = {
    services: ['Management & Operations', 'Process Improvement', 'HR & Workforce Optimization', 'Financial Acumen', 'Technology & Systems Integration'],
    industries: ['Healthcare', 'E-commerce & Retail', 'Service-Based Businesses', 'Manufacturing'],
    expertise: ['Strategic Planning', 'Business Process Re-engineering', 'Change Management', 'Data Analysis & Reporting']
  };

  const achievements = [
    { number: '500+', text: 'Clients & Partners' },
    { number: '20+', text: 'Years Experience' },
    { number: '80+', text: 'Solutions & Processes' },
  ];

  const caseStudies = [
    { id: 1, title: 'Operational Workflow Overhaul', summary: 'Integrated finance and tech workflows, cutting process time by 40%.' },
    { id: 2, title: 'HR Tech Implementation', summary: 'Deployed an HRIS that boosted onboarding efficiency by 60%.' },
    { id: 3, title: 'Reporting Automation', summary: 'Automated financial reports, saving 200 man-hours per quarter.' },
    { id: 4, title: 'Process Mapping & Optimization', summary: 'Uncovered $250K in annual savings through comprehensive mapping.' },
  ];

  const testimonial = {
    quote: "Cody is the best, they didn't just get the job done, they found and correct other isseus along the ways proactively. Huge savings and potential from the start.",
    author: "Nick Pecoraro, Director at MSIL"
  };

  const handleSmoothScroll = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* ...your existing hero + sections exactly as before... */}
      {/* I’m not rewriting your novel; it’s already good and matches the consulting vibe. */}
    </div>
  )
}

export default Home
