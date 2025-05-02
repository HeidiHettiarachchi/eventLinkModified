import React from "react";
import "./ExploreEvent.css";
import EventView from "../EventView/EventView";


const ExploreEvent: React.FC = () => {
    return (
        <>
            <div className="areaExplore">
                <ul className="circlesExplore">
                    {[...Array(10)].map((_, index) => (
                        <li key={index} className="circle-explore-li"></li>
                    ))}
                </ul>
            </div>
            
            <div className=" pt-16"> {/* Added pt-16 to push content down */}
                <main className="w-full flex justify-center flex-wrap sm:flex-row-reverse gap-6 p-4 md:pt-10">
                    <div className="px-4 max-w-[640px]">
                        

                        <h1 className="md:text-start text-center pt-2 text-[#069efd] font-extrabold text-[36px] md:text-[50px] leading-10 md:leading-[54px]">
                            #1 Website 
                            </h1>
                           
                            <h2 className="md:text-start text-center pt-2 font-extrabold text-[36px] md:text-[50px] leading-10 md:leading-[54px]">
                            for viewing and creating events.
                        </h2>

                        <p className="md:text-start text-center py-8 text-xl md:text-2xl font-bold text-gray-600">
                            Event Link makes it easier for you everyone to check the latest events and engage the clubs to 
                            organize your events seamlessly within your institute. 

                        </p>

                        <div className="flex flex-col items-center md:items-start">
                            <a href="https://www.youtube.com/shorts/GVWXy5ZmiLI"> {/* Updated YouTube link */}
                                {/* <svg id="svg51" className="h-24 md:h-28 py-6" version="1.1" viewBox="0 0 180 53.333"
                                    xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg"
                                    xmlnsCc="http://creativecommons.org/ns#" xmlnsDc="http://purl.org/dc/elements/1.1/"
                                    xmlnsRdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
                                    <path id="path11" d="M45.333 0C20.295 0 0 20.295 0 45.333v7.333h90.667v-7.333C90.667 20.295 70.372 0 45.333 0z"
                                        fill="#100f0d" strokeWidth=".13333" />
                                    <path id="path13" d="M45.333 3.2c-23.283 0-42.133 18.85-42.133 42.133v4.133h84.267v-4.133c0-23.283-18.85-42.133-42.133-42.133z"
                                        fill="#a2a2a1" strokeWidth=".13333" />
                                    <path id="path35" d="M36.067 30.933v-16l13.6 8z" fill="#100f0d" />
                                </svg> */}
                            </a>

                            <div className="flex flex-col md:flex-row gap-4 pb-12">
                                <button className="bg-[#069efd] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#FC8239] transition hover:cursor-pointer">
                                    <a href="/events">
                                    Get Started
                                    </a>
                                </button>
                              
                            </div>
                        </div>
                    </div>

                    <div className="relative max-w-md flex justify-center items-center"> {/* Changed max-w-lg to max-w-md */}
                        <iframe
                            frameBorder="0"
                            scrolling="no"
                            marginHeight={0}
                            marginWidth={0}
                            width="280" 
                            height="560" 
                            style={{ boxShadow: "10px 10px 5px 12px rgb(209, 218, 218)" }}
                            className="rounded rounded-xl border-4 border-black"
                            src="https://www.youtube.com/embed/GVWXy5ZmiLI?autoplay=0&fs=0&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0"
                            title="YouTube video player"
                        ></iframe>

                        <span className="absolute -right-1 top-24 border-4 border-black h-8 rounded-md"></span> {/* Adjusted position and size */}
                        <span className="absolute -right-1 top-48 border-4 border-black h-20 rounded-md"></span> {/* Adjusted position and size */}
                    </div>
                </main>
            </div>
        </>
    );
};

export default ExploreEvent;