import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

function Home() {
  // State to manage the visibility of the "Case Studies" collapsed cards
  const [openCaseStudy, setOpenCaseStudy] = useState(null);

  // Refs for each section to enable smooth scrolling
  const aboutRef = useRef(null);
  const whatWeOfferRef = useRef(null);
  const clientsRef = useRef(null);
  const caseStudiesRef = useRef(null);
  const testimonialRef = useRef(null);
  const portalRef = useRef(null);

  // Data for the content sections
  const sections = [
    { id: 'about', title: 'About', ref: aboutRef },
    { id: 'what-we-offer', title: 'What We Offer', ref: whatWeOfferRef },
    { id: 'clients', title: 'Clients', ref: clientsRef },
    { id: 'case-studies', title: 'Case Studies', ref: caseStudiesRef },
    { id: 'testimonial', title: 'Testimonials', ref: testimonialRef },
    { id: 'portal', title: 'Client Portal', ref: portalRef },
  ];

  // Live content from qially.me
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
    {
      id: 1,
      title: 'Operational Workflow Overhaul',
      summary: 'Integrated finance and tech workflows, cutting process time by 40%.',
    },
    {
      id: 2,
      title: 'HR Tech Implementation',
      summary: 'Deployed an HRIS that boosted onboarding efficiency by 60%.',
    },
    {
      id: 3,
      title: 'Reporting Automation',
      summary: 'Automated financial reports, saving 200 man-hours per quarter.',
    },
    {
      id: 4,
      title: 'Process Mapping & Optimization',
      summary: 'Uncovered $250K in annual savings through comprehensive mapping.',
    },
  ];

  const testimonial = {
    quote: "Cody is the best, they didn't just get the job done, they found and correct other isseus along the ways proactively. Huge savings and potential from the start.",
    author: "Nick Pecoraro, Director at MSIL"
  };

  // Handler for smooth scrolling to sections
  const handleSmoothScroll = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium gradient background with bokeh effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        {/* Animated bokeh lighting effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-turquoise-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-electric-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute -bottom-8 left-40 w-96 h-96 bg-plasma-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-turquoise-500/5 to-electric-blue-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      </div>

      {/* Sticky Navigation Bar */}
      <nav className="sticky top-0 z-50 py-4 px-6 md:px-12 backdrop-filter backdrop-blur-md glass shadow-lg rounded-b-xl transition-all duration-300">
        <div className="container mx-auto flex justify-center space-x-4 md:space-x-8">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => handleSmoothScroll(section.ref)}
              className="text-white text-sm md:text-base font-medium hover:text-turquoise-300 transition-colors duration-200"
            >
              {section.title}
            </button>
          ))}
        </div>
      </nav>

      {/* Main content container */}
      <main className="relative z-10">
        {/* Hero Section with QiSuite Portal */}
        <section ref={portalRef} className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            <div className="glass-card p-12 text-center">
              {/* QiSuite Logo and Branding */}
              <div className="mb-12">
                {/* Hummingbird Logo */}
                <div className="w-32 h-32 mx-auto mb-8 relative">
                  <div className="w-full h-full bg-gradient-to-br from-turquoise-400 via-electric-blue-400 to-plasma-purple-400 rounded-3xl flex items-center justify-center shadow-2xl glow">
                    <svg className="w-20 h-20 text-white" viewBox="0 0 24 24" fill="currentColor">
                      {/* Hummingbird icon */}
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  {/* Glowing ring effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-turquoise-400/20 via-electric-blue-400/20 to-plasma-purple-400/20 blur-xl animate-pulse"></div>
                </div>
                
                {/* Brand Title */}
                <h1 className="text-6xl font-bold gradient-text mb-4 tracking-tight">
                  QiSuite™
                </h1>
                <p className="text-xl text-gray-300 font-light mb-2">Enterprise Client Portal</p>
                <p className="text-gray-400 text-lg">Secure • Fast • Reliable</p>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="glass-card p-6 border border-turquoise-500/20">
                  <div className="w-12 h-12 bg-turquoise-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-turquoise-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Enterprise Security</h3>
                  <p className="text-gray-400 text-sm">Bank-grade encryption and secure authentication</p>
                </div>
                
                <div className="glass-card p-6 border border-electric-blue-500/20">
                  <div className="w-12 h-12 bg-electric-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-electric-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
                  <p className="text-gray-400 text-sm">Optimized performance for seamless experience</p>
                </div>
                
                <div className="glass-card p-6 border border-plasma-purple-500/20">
                  <div className="w-12 h-12 bg-plasma-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-plasma-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Analytics Ready</h3>
                  <p className="text-gray-400 text-sm">Comprehensive insights and reporting tools</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link 
                    to="/login" 
                    className="group relative overflow-hidden glass-button px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 border border-turquoise-500/30"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-turquoise-500/10 to-electric-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex items-center justify-center">
                      <svg className="w-6 h-6 mr-3 text-turquoise-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-lg font-semibold text-white">Client Access</span>
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-turquoise-400/20 to-electric-blue-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </Link>

                  <Link 
                    to="/admin" 
                    className="group relative overflow-hidden glass-button px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 border border-plasma-purple-500/30"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-plasma-purple-500/10 to-electric-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex items-center justify-center">
                      <svg className="w-6 h-6 mr-3 text-plasma-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="text-lg font-semibold text-white">Admin Portal</span>
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-plasma-purple-400/20 to-electric-blue-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </Link>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-turquoise-400 rounded-full mr-2 animate-pulse"></div>
                    <span className="font-medium">99.9% Uptime</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-electric-blue-400 rounded-full mr-2 animate-pulse" style={{animationDelay: '1s'}}></div>
                    <span className="font-medium">SOC 2 Compliant</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-plasma-purple-400 rounded-full mr-2 animate-pulse" style={{animationDelay: '2s'}}></div>
                    <span className="font-medium">24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section ref={aboutRef} className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="glass-card p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">QiAlly</h2>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Transforming operations into thriving systems.
              </h3>
              <p className="text-lg text-gray-300 font-light mb-4">
                Empower. Innovate. Grow.
              </p>
              <p className="text-gray-400 max-w-2xl mx-auto">
                We specialize in operational excellence, helping businesses streamline processes, 
                optimize workflows, and achieve sustainable growth through strategic consulting and 
                technology integration.
              </p>
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section ref={whatWeOfferRef} className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="glass-card p-12">
              <h3 className="text-3xl font-bold text-center gradient-text mb-12">What We Offer</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Services List */}
                <div className="glass-card p-6 border border-turquoise-500/20">
                  <h4 className="text-xl font-semibold mb-4 text-turquoise-300">Services</h4>
                  <ul className="space-y-3 text-gray-300">
                    {whatWeOffer.services.map((service, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-turquoise-400 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Industries List */}
                <div className="glass-card p-6 border border-electric-blue-500/20">
                  <h4 className="text-xl font-semibold mb-4 text-electric-blue-300">Industries</h4>
                  <ul className="space-y-3 text-gray-300">
                    {whatWeOffer.industries.map((industry, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-electric-blue-400 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <span>{industry}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Expertise List */}
                <div className="glass-card p-6 border border-plasma-purple-500/20">
                  <h4 className="text-xl font-semibold mb-4 text-plasma-purple-300">Expertise</h4>
                  <ul className="space-y-3 text-gray-300">
                    {whatWeOffer.expertise.map((exp, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-plasma-purple-400 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <span>{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clients & Partners Section */}
        <section ref={clientsRef} className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="glass-card p-12 text-center">
              <h3 className="text-3xl font-bold gradient-text mb-12">Clients & Partners</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {achievements.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <p className="text-5xl md:text-6xl font-extrabold text-white mb-2">{item.number}</p>
                    <p className="text-lg text-gray-300 font-light">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Case Studies Section */}
        <section ref={caseStudiesRef} className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="glass-card p-12">
              <h3 className="text-3xl font-bold text-center gradient-text mb-12">Case Studies</h3>
              <div className="space-y-4">
                {caseStudies.map(study => (
                  <div key={study.id} className="glass-card p-6 border border-white/10 transition-all duration-300 group hover:border-turquoise-500/30">
                    <button
                      onClick={() => setOpenCaseStudy(openCaseStudy === study.id ? null : study.id)}
                      className="w-full flex justify-between items-center text-left"
                    >
                      <div>
                        <h4 className="text-lg font-semibold text-white group-hover:text-turquoise-300 transition-colors duration-200">{study.title}</h4>
                        <p className="text-sm text-gray-400 mt-1">{study.summary}</p>
                      </div>
                      <span className={`text-2xl transform transition-transform duration-300 group-hover:rotate-90 ${openCaseStudy === study.id ? 'rotate-90' : 'rotate-0'}`}>
                        &gt;
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section ref={testimonialRef} className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="glass-card p-12">
              <h3 className="text-3xl font-bold text-center gradient-text mb-12">What Our Clients Say</h3>
              <div className="glass-card p-8 border-l-4 border-turquoise-400">
                <p className="text-xl italic text-gray-200 mb-6">
                  &quot;{testimonial.quote}&quot;
                </p>
                <p className="text-lg font-semibold text-turquoise-300">- {testimonial.author}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home
  