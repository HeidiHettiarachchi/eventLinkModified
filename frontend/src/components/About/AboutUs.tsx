import React from 'react';
import aboutUsImage from "../../../public/assets/aboutUs.png";
import './AboutUs.css';

const AboutUs: React.FC = () => {
    return (
        <>
            {/* Background Animation */}
            <div className="areaAbout">
                <ul className="circlesAbout">
                    {[...Array(10)].map((_, index) => (
                        <li key={index} className="circle-about-li"></li>
                    ))}
                </ul>
            </div>

        

            <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
                    <div className="max-w-lg">
                        <h2 className="text-3xl font-extrabold text-[#FC8239] sm:text-4xl hover:text-[#069efd] transition-colors duration-300">About Us</h2>
                        <p className="mt-4 text-gray-600 text-lg">
                        At EventLink, we welcome everyone to stay connected and up to date with the latest events hosted by our vibrant clubs and societies. Our platform is designed to be a centralized hub where students, members, and organizers can come together with ease. Whether you're attending or organizing, EventLink simplifies the entire process—offering a seamless experience for planning, managing, and discovering events that bring our community to life.
                        </p>
                        <div className="mt-8">
                            <a href="#eventExplore" className="text-[#FC8239] hover:text-[#069efd] font-medium transition-colors duration-300">
                                Explore Event teaser <span className="ml-2">&#8594;</span>
                            </a>
                        </div>
                    </div>
                    <div className="mt-12 md:mt-0 overflow-hidden rounded-lg">
                        <img
                            src={aboutUsImage}
                            alt="About Us"
                            className="object-cover w-full h-auto transition-transform duration-500 hover:scale-105"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AboutUs;