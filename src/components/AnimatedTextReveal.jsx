import React, { useRef, useEffect, useState } from 'react';

const AnimatedTextReveal = ({ text, animationType = 'ltr', delay = 0 }) => {
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            setIsVisible(true);
                        }, delay); // Use the delay prop here
                        observer.unobserve(entry.target); // Observe only once
                    }
                });
            },
            { threshold: 0.5 } // Trigger when 50% of the element is visible
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, [delay]);

    return (
        <div 
            ref={sectionRef} 
            className={`about-reveal-headline relative inline-block ${animationType === 'ltr' ? 'animation-ltr' : 'animation-rtl'} ${isVisible ? 'animate-in' : ''}`}
        >
            <p className="font-montserrat text-5xl md:text-6xl lg:text-7xl font-extrabold p-5 uppercase text-about-dark-mix">
                {text}
            </p>
        </div>
    );
};

export default AnimatedTextReveal;