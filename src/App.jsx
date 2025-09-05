import React from 'react';
import AnimatedBackground from './components/AnimatedBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="relative">
      <AnimatedBackground />
      <Navbar />
      <main>
        <Hero />
        <About />
        {/* We will build these out next! */}
        {/* <Services /> */}
        <Projects /> {/* <-- Add it here */}
        {/* <Contact /> */}
      </main>
      {/* <Footer /> */}
    </div>
  )
}

export default App;