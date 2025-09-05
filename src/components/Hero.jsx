import React, { useEffect } from 'react';
import profileImage from '../assets/mahmud-profile.png'; // <-- IMPORT YOUR IMAGE

const Hero = () => {
    useEffect(() => {
        // Trigger animations on load
        const timeout = setTimeout(() => {
            document.getElementById('name').classList.add('animate-in');
            document.getElementById('photo-container').classList.add('animate-in');
        }, 100);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <section id="home" className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden">
            <div className="relative z-10 w-full max-w-6xl mx-auto">
                <div className="flex flex-col items-center justify-between gap-16 lg:flex-row">
                    {/* Text Content */}
                    <div className="flex-1 max-w-2xl text-center lg:text-left">
                        <h1 className="text-3xl font-light opacity-0 animate-[fadeInUp_0.8s_0.2s_forwards]">
                            <span className="wave">👋</span> Hi, It's
                        </h1>
                        <h1 id="name" className="text-6xl font-bold leading-tight name md:text-8xl">
                            MAHMUD
                        </h1>
                        <div className="relative inline-block my-6">
                            <div className="relative z-10 text-4xl font-bold md:text-5xl">
                                <span className="block auto-text">AUTOMATION</span>
                                <span className="block expert-text">EXPERT</span>
                            </div>
                            <div className="tagline-glow"></div>
                        </div>
                        <p className="max-w-md mx-auto my-8 text-lg leading-relaxed text-gray-300 lg:mx-0">
                            Transforming workflows with cutting-edge automation solutions. Efficiency redefined, processes perfected.
                        </p>
                        <div className="flex justify-center gap-6 lg:justify-start">
                            <button className="relative px-8 py-3 overflow-hidden font-medium text-white transition-all duration-300 border-none rounded-full outline-none cursor-pointer cta-btn primary">
                                View My Work
                            </button>
                            <button className="px-8 py-3 font-medium transition-all duration-300 rounded-full cursor-pointer cta-btn secondary">
                                Contact Me
                            </button>
                        </div>
                    </div>

                    {/* Photo Content */}
                    <div className="flex flex-col items-center flex-1">
                        <div id="photo-container" className="relative flex items-center justify-center w-80 h-80 profile-photo">
                            <div className="absolute w-full h-full photo-glow"></div>
                            <div className="absolute z-10 w-[340px] h-[340px] hexagon hex2"></div>
                            <div className="absolute z-20 w-full h-full hexagon"></div>
                            <img
                                src={profileImage}
                                alt="Professional portrait of Mahmud"
                                className="absolute z-30 object-cover w-[90%] h-[90%] profile-img"
                            />
                        </div>
                        <div className="z-10 flex gap-6 mt-8">
                            <div className="icon" title="Python"><span>🐍</span></div>
                            <div className="icon" title="Selenium"><span>🖥️</span></div>
                            <div className="icon" title="RPA"><span>🤖</span></div>
                            <div className="icon" title="API"><span>🔌</span></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 scroll-indicator">
                <div className="mouse w-[30px] h-[50px] rounded-2xl relative">
                    <div className="wheel w-[6px] h-[10px] rounded-full absolute top-[5px] left-1/2 -translate-x-1/2"></div>
                </div>
                <p className="mt-2 text-sm">Scroll to explore</p>
            </div>
        </section>
    );
};

export default Hero;