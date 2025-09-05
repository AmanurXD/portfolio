import React from 'react';
import LottieAnimation from './LottieAnimation';
import AnimatedTextReveal from './AnimatedTextReveal';
import AnimatedParagraph from './AnimatedParagraph';

const About = () => {
    // Using your working .json URL!
    const lottieUrl = "https://lottie.host/b41504fe-391e-4042-841b-d740e48a0ee9/GPnNFP3xeC.json";
    const headlineText = "It is Me, The Solution";
    const paragraphText = `I craft bespoke automation flows that free up your valuable time, boost efficiency, and eliminate manual drudgery. With expertise in Python, Selenium, RPA, and API integrations, I'm here to streamline your operations and unleash your team's full potential. Let's automate the mundane, so you can focus on the magnificent.`;

    return (
        <section id="about" className="flex items-center min-h-screen p-4 overflow-hidden">
    <div className="container mx-auto max-w-6xl w-full">
        <div className="flex flex-col lg:flex-row items-start gap-8 w-full">
            {/* Lottie Animation - Left Column */}
            <div className="w-full lg:w-1/2 flex justify-start">
                <div className="w-[500px] h-[500px]"> {/* Adjust size as needed */}
                    <LottieAnimation src={lottieUrl} />
                </div>
            </div>
            {/* Text Content - Right Column */}
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start">
                <AnimatedTextReveal text={headlineText} animationType="ltr" />
                <div className="mt-6 max-w-xl text-center lg:text-left">
                    <AnimatedParagraph text={paragraphText} />
                </div>
            </div>
        </div>
    </div>
</section>


    );
};

export default About;