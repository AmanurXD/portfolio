import React, { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
    const particlesContainerRef = useRef(null);

    useEffect(() => {
        const container = particlesContainerRef.current;
        if (!container) return;

        // Clear existing particles to avoid duplicates on re-renders
        container.innerHTML = '';

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            const size = Math.random() * 5 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.left = `${Math.random() * 100}%`;
            
            const animationDuration = Math.random() * 5 + 5; // 5 to 10 seconds
            const animationDelay = Math.random() * 5;
            particle.style.animationDuration = `${animationDuration}s`;
            particle.style.animationDelay = `${animationDelay}s`;

            container.appendChild(particle);
        }
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10">
            <div className="glow-circle glow-1"></div>
            <div className="glow-circle glow-2"></div>
            <div className="glow-circle glow-3"></div>
            <div ref={particlesContainerRef} className="particles"></div>
        </div>
    );
};

export default AnimatedBackground;