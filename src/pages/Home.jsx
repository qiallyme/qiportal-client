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
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/5 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500/5 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-cyan-500/5 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section with QiAlly Branding */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            {/* Logo */}
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl2 flex items-center justify-center mx-auto mb-8 p-4">
              <img src="/logo.svg" alt="QiAlly Logo" className="w-full h-full object-contain" />
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">QiAlly™</span>
            </h1>
            
            {/* Tagline */}
            <p className="text-2xl md:text-3xl text-gray-700 mb-4 font-light">
              Systems That Breathe
            </p>
            
            {/* Short line */}
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              The QiSuite™ Portal is live. The full site launches soon.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link 
                to="/login" 
                className="btn btn-primary btn-lg px-8"
              >
                Access Portal
              </Link>
              <a 
                href="mailto:info@qially.me" 
                className="btn btn-ghost btn-lg px-8"
              >
                Join the Waitlist
              </a>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex justify-center items-center space-x-8">
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Secure</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Fast</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                <span className="text-sm">Reliable</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 gradient-text">About QiAlly</h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              We transform chaos into clarity. Through modular systems, client portals, and operational revival, 
              we help businesses breathe easier and operate more efficiently.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {achievements.map((achievement, index) => (
                <div key={index} className="glass p-6 rounded-xl2">
                  <div className="text-3xl font-bold gradient-text mb-2">{achievement.number}</div>
                  <div className="text-gray-600">{achievement.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section ref={whatWeOfferRef} className="relative z-10 py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center gradient-text">What We Offer</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Services */}
              <div className="glass p-8 rounded-xl2">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Services</h3>
                <ul className="space-y-3">
                  {whatWeOffer.services.map((service, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Industries */}
              <div className="glass p-8 rounded-xl2">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Industries</h3>
                <ul className="space-y-3">
                  {whatWeOffer.industries.map((industry, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">{industry}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Expertise */}
              <div className="glass p-8 rounded-xl2">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Expertise</h3>
                <ul className="space-y-3">
                  {whatWeOffer.expertise.map((expertise, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                      <span className="text-gray-700">{expertise}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section ref={caseStudiesRef} className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center gradient-text">Case Studies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {caseStudies.map((study) => (
                <div key={study.id} className="glass p-8 rounded-xl2 hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">{study.title}</h3>
                  <p className="text-gray-600">{study.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section ref={testimonialRef} className="relative z-10 py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass p-12 rounded-xl2">
              <blockquote className="text-2xl md:text-3xl text-gray-700 mb-6 italic">
                "{testimonial.quote}"
              </blockquote>
              <cite className="text-lg text-gray-600 font-semibold">
                — {testimonial.author}
              </cite>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={portalRef} className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 gradient-text">Ready to Get Started?</h2>
            <p className="text-xl text-gray-700 mb-12">
              Access your portal or get in touch to learn how we can help transform your operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/login" 
                className="btn btn-primary btn-lg px-8"
              >
                Access Portal
              </Link>
              <a 
                href="mailto:info@qially.me" 
                className="btn btn-ghost btn-lg px-8"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
