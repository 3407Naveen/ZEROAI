import React from 'react';
import Header from './components/Header';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import AIServices from './components/sections/AIServices';
import Features from './components/sections/Features';
import Testimonials from './components/sections/Testimonials';
import Contact from './components/sections/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <Hero />
      <About />
      <AIServices />
      <Features />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
