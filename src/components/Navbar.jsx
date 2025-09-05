import React from 'react';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 z-50 w-full bg-black bg-opacity-20 backdrop-blur-md">
            <div className="container flex items-center justify-between h-20 mx-auto px-4">
                <a href="#home" className="text-2xl font-bold">Mahmud.dev</a>
            </div>
        </nav>
    );
};

export default Navbar;