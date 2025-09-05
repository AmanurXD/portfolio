import React, { useRef, useEffect, useState } from 'react';

const AnimatedParagraph = ({ text }) => {
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        const currentRef = sectionRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    // This is the new, smarter function!
    const spanizeText = (text) => {
        let charIndex = 0; // A counter for the overall character index
        const words = text.split(' '); // Split the text into an array of words

        return words.map((word, wordIndex) => (
            <React.Fragment key={wordIndex}>
                {/* This outer span acts as the word wrapper */}
                <span className="word-wrapper" style={{ display: 'inline-block' }}>
                    {word.split('').map((char, charInWordIndex) => {
                        const animationDelay = isVisible ? `${(charIndex++) * 0.02}s` : '0s';
                        return (
                            <span
                                key={charInWordIndex}
                                className={isVisible ? 'about-paragraph-animated' : ''}
                                style={{ animationDelay: animationDelay }}
                            >
                                {char}
                            </span>
                        );
                    })}
                </span>
                {/* Add a space back between the words */}
                {' '}
            </React.Fragment>
        ));
    };

    return (
        <p ref={sectionRef} className="font-mono text-base md:text-lg leading-relaxed text-gray-300">
            {spanizeText(text)}
        </p>
    );
};

export default AnimatedParagraph;