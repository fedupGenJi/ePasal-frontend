import React from 'react';
import bgLogin from '../assets/backgroundImage.jpg';

const Background: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center filter backdrop-blur-sm scale-105 z-0"
                style={{
                    backgroundImage: `url(${bgLogin})`,
                }}
            ></div>

            <div className="absolute inset-0 bg-black bg-opacity-40 z-0" />

            <div
                className="absolute inset-0 bg-black bg-opacity-85 backdrop-blur-md z-10"
                style={{
                    WebkitMaskImage: `radial-gradient(ellipse 45% 79% at 100% center, transparent 65%, rgba(0,0,0,0.5) 90%, black 100%)`,
                    maskImage: `radial-gradient(ellipse 45% 79% at 100% center, transparent 65%, rgba(0,0,0,0.5) 90%, black 100%)`,
                    WebkitMaskComposite: 'destination-out',
                    maskComposite: 'exclude',
                }}
            />


            <div className="relative z-20 min-h-screen flex items-center justify-center px-4">
                {children}
            </div>
        </div>
    );
};

export default Background;