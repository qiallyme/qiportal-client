import { useState, useRef } from 'react';

// The main App component that acts as the Home.jsx page
export default function App() {
  // State to manage the visibility of the "Case Studies" collapsed cards
  const [openCaseStudy, setOpenCaseStudy] = useState(null);

  // Refs for each section to enable smooth scrolling
  const aboutRef = useRef(null);
  const whatWeOfferRef = useRef(null);
  const clientsRef = useRef(null);
  const caseStudiesRef = useRef(null);
  const testimonialRef = useRef(null);
  const ctaRef = useRef(null);

  // Data for the content sections
  const sections = [
    { id: 'about', title: 'About', ref: aboutRef },
    { id: 'what-we-offer', title: 'What We Offer', ref: whatWeOfferRef },
    { id: 'clients', title: 'Clients', ref: clientsRef },
    { id: 'case-studies', title: 'Case Studies', ref: caseStudiesRef },
    { id: 'testimonial', title: 'Testimonials', ref: testimonialRef },
    { id: 'cta', title: 'Start Your Journey', ref: ctaRef },
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
    // Main container with a dark gradient background and a glowing effect
    <div className="relative min-h-screen font-sans text-white overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-950 to-purple-950">
      {/* Background with a noise filter and dynamic blob animation */}
      <div className="absolute inset-0 z-0 opacity-80" style={{
        backgroundImage: `radial-gradient(ellipse at 50% 50%, #4f46e520 0%, transparent 80%)`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
      }}></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-soft-light blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-soft-light blur-3xl opacity-60 animate-blob animation-delay-2000"></div>

      {/* Sticky Navigation Bar */}
      <nav className="sticky top-0 z-50 py-4 px-6 md:px-12 backdrop-filter backdrop-blur-md bg-white/10 shadow-lg rounded-b-xl transition-all duration-300">
        <div className="container mx-auto flex justify-center space-x-4 md:space-x-8">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => handleSmoothScroll(section.ref)}
              className="text-white text-sm md:text-base font-medium hover:text-indigo-300 transition-colors duration-200"
            >
              {section.title}
            </button>
          ))}
        </div>
      </nav>

      {/* Main content container with the glassmorphism effect */}
      <main className="container mx-auto py-16 px-4 md:px-8 lg:py-24 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-4xl bg-white/5 rounded-3xl backdrop-filter backdrop-blur-lg shadow-2xl border-2 border-white/20 p-6 md:p-12 lg:p-16 transform transition-all duration-500 hover:shadow-3xl hover:border-white/40">

          {/* Header Section with dynamic elements */}
          <header ref={aboutRef} className="text-center mb-12 animate-fade-in">
            {/* Logo placeholder with pulsating effect */}
            <div className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-400 animate-pulse-logo">
              QiAlly
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-wide text-white animate-slide-up">
              Transforming operations into thriving systems.
            </h1>
            <h2 className="text-lg md:text-xl text-gray-300 font-light mt-4 max-w-2xl mx-auto animate-fade-in animation-delay-500">
              Empower. Innovate. Grow.
            </h2>
          </header>

          {/* 'What We Offer' Section */}
          <section ref={whatWeOfferRef} className="py-12 border-t border-white/20">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center text-indigo-300">What We Offer</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Services List */}
              <div className="bg-white/5 p-6 rounded-2xl shadow-inner backdrop-blur-sm transition-transform duration-300 hover:scale-105">
                <h4 className="text-xl font-semibold mb-3 text-indigo-200">Services</h4>
                <ul className="space-y-2 text-gray-300">
                  {whatWeOffer.services.map((service, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-indigo-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Industries List */}
              <div className="bg-white/5 p-6 rounded-2xl shadow-inner backdrop-blur-sm transition-transform duration-300 hover:scale-105">
                <h4 className="text-xl font-semibold mb-3 text-indigo-200">Industries</h4>
                <ul className="space-y-2 text-gray-300">
                  {whatWeOffer.industries.map((industry, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-indigo-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                      <span>{industry}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expertise List */}
              <div className="bg-white/5 p-6 rounded-2xl shadow-inner backdrop-blur-sm transition-transform duration-300 hover:scale-105">
                <h4 className="text-xl font-semibold mb-3 text-indigo-200">Expertise</h4>
                <ul className="space-y-2 text-gray-300">
                  {whatWeOffer.expertise.map((exp, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-indigo-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                      <span>{exp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 'Clients & Partners' Section */}
          <section ref={clientsRef} className="py-12 border-t border-white/20">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center text-indigo-300">Clients & Partners</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {achievements.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <p className="text-4xl md:text-5xl font-extrabold text-white">{item.number}</p>
                  <p className="text-base md:text-lg text-gray-300 font-light mt-1">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 'Case Studies' Section */}
          <section ref={caseStudiesRef} className="py-12 border-t border-white/20">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center text-indigo-300">Case Studies</h3>
            <div className="space-y-4">
              {caseStudies.map(study => (
                <div key={study.id} className="bg-white/5 p-4 rounded-xl backdrop-blur-sm transition-all duration-300 group">
                  <button
                    onClick={() => setOpenCaseStudy(openCaseStudy === study.id ? null : study.id)}
                    className="w-full flex justify-between items-center text-left"
                  >
                    <div>
                      <h4 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors duration-200">{study.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{study.summary}</p>
                    </div>
                    <span className={`text-2xl transform transition-transform duration-300 group-hover:rotate-90 ${openCaseStudy === study.id ? 'rotate-90' : 'rotate-0'}`}>
                      &gt;
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* 'Testimonial' Section */}
          <section ref={testimonialRef} className="py-12 border-t border-white/20">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center text-indigo-300">What Our Clients Say</h3>
            <div className="bg-white/5 p-8 rounded-2xl border-l-4 border-indigo-400 shadow-xl backdrop-blur-sm">
              <p className="text-xl italic text-gray-200">
                &quot;{testimonial.quote}&quot;
              </p>
              <p className="mt-4 text-lg font-semibold text-indigo-300">- {testimonial.author}</p>
            </div>
          </section>

          {/* 'Call to Action' Section */}
          <section ref={ctaRef} className="py-12 border-t border-white/20">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center text-indigo-300">Start Your Journey</h3>
            <p className="text-base text-gray-300 mb-6 text-center">
              Let's connect and turn your challenges into opportunities.
            </p>
            <form className="w-full max-w-lg mx-auto space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-gray-400"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-gray-400"
              />
              <textarea
                placeholder="Your Message"
                rows="4"
                className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-gray-400 resize-none"
              ></textarea>
              <button
                type="submit"
                className="w-full px-6 py-3 rounded-xl font-bold text-white bg-indigo-500 hover:bg-indigo-600 transition-colors duration-200 transform hover:scale-105"
              >
                Start Your Journey
              </button>
            </form>
          </section>

        </div>
      </main>

      {/* Tailwind CSS utility classes */}
      <style>{`
        /* Custom animation for the floating glow effects */
        @keyframes blob {
          0% {
            transform: scale(1) translate(0px, 0px);
          }
          33% {
            transform: scale(1.1) translate(30px, -50px);
          }
          66% {
            transform: scale(0.9) translate(-20px, 20px);
          }
          100% {
            transform: scale(1) translate(0px, 0px);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Animation for the header text and logo */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulseLogo {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .animate-fade-in { animation: fadeIn 1s ease-out; }
        .animate-slide-up { animation: slideUp 1s ease-out; }
        .animate-pulse-logo { animation: pulseLogo 3s infinite ease-in-out; }

        /* Style for smooth scrolling - though handled by JS */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}

