import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EventNavbar from "./EventNavbar";
import "./EventView.css";
import Footer from "../../components/Footer/Footer";
import { getAllEventsAPI } from "../../services/EventService";
import { IEvent } from "../../types/IResponse";
import { MdDateRange, MdAccessTime, MdCategory, MdLocationOn, MdSearch, MdFilterList, MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const EventView: React.FC = () => {
    const [events, setEvents] = useState<IEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // New state variables for search, filters and pagination
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [eventsPerPage] = useState(9); // 3x3 grid
    const [filterType, setFilterType] = useState<string>("All");
    const [filteredEvents, setFilteredEvents] = useState<IEvent[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsData = await getAllEventsAPI();
                const approvedEvents = eventsData.filter(
                    (event) => event.eventStatus === "Approved"
                );
                setEvents(approvedEvents);
                setFilteredEvents(approvedEvents); // Initialize filtered events
            } catch (err) {
                console.error("Error fetching events:", err);
                setError("Failed to load events. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Filter and search effect
    useEffect(() => {
        if (!events.length) return;
        
        let result = [...events];
        
        // Apply search filter
        if (searchTerm) {
            result = result.filter(event => 
                event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (event.eventVenue && event.eventVenue.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        
        // Apply type filter
        if (filterType !== "All") {
            result = result.filter(event => event.eventType === filterType);
        }
        
        setFilteredEvents(result);
        setCurrentPage(1); // Reset to first page when filters change
    }, [searchTerm, filterType, events]);

    // Get unique event types for filter dropdown
    const eventTypes = ["All", ...Array.from(new Set(events.map(event => event.eventType)))];

    // Pagination logic
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

    const paginate = (pageNumber: number) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            // Scroll to top of events section
            document.getElementById('events-list')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Format date for better display
    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div id="events">
            <EventNavbar />
            <div className="areaEvent">
                <ul className="circlesEvent">
                    {[...Array(10)].map((_, index) => (
                        <li key={index} className="circle-event-li"></li>
                    ))}
                </ul>
            </div>

            <div className="waveEvent">
                <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fill="#ffffff"
                        fillOpacity="1"
                        d="M0,224L60,197.3C120,171,240,117,360,101.3C480,85,600,107,720,138.7C840,171,960,213,1080,197.3C1200,181,1320,107,1380,69.3L1440,32L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                    />
                </svg>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-start pt-16 px-4 text-center">
                <h1 className="animate-bounce font-poppins mb-8 flex space-x-1 rounded px-4 py-2 text-7xl font-bold tracking-wide text-white mt-20">
                    Events
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-md">
                        {error}
                    </div>
                ) : (
                    <>
                        {/* Search and Filter Section */}
                        <div id="events-list" className="w-full max-w-5xl mx-auto mb-8">
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Search */}
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MdSearch className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search events by name or venue..."
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    
                                    {/* Filter */}
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MdFilterList className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <select
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full appearance-none bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            value={filterType}
                                            onChange={(e) => setFilterType(e.target.value)}
                                        >
                                            {eventTypes.map(type => (
                                                <option key={type} value={type}>
                                                    {type === "All" ? "All Event Types" : type}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 text-left text-sm text-gray-600">
                                    {filteredEvents.length === 0 ? (
                                        <p>No events match your search criteria</p>
                                    ) : (
                                        <p>Showing <span className="font-medium">{Math.min(filteredEvents.length, indexOfFirstEvent + 1)}-{Math.min(indexOfLastEvent, filteredEvents.length)}</span> of <span className="font-medium">{filteredEvents.length}</span> events</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {filteredEvents.length === 0 ? (
                            <div className="bg-white/80 p-8 rounded-lg shadow-lg max-w-lg mx-auto backdrop-blur-sm">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Events Found</h3>
                                <p className="text-gray-600">
                                    {searchTerm || filterType !== "All" ? 
                                        "No events match your search criteria. Try adjusting your filters." : 
                                        "There are no approved events available at the moment. Please check back later."}
                                </p>
                            </div>
                        ) : (
                            <div className="container mx-auto py-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                                    {currentEvents.map((event) => (
                                        <Link 
                                            to={`/events/${event._id}`} 
                                            key={event._id} 
                                            className="transform transition duration-300 hover:scale-105"
                                        >
                                            <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
                                                {/* Event image - show event image if available, otherwise fallback */}
                                                <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                                                    <img 
                                                        src={event.eventImage || "/images/default-event.jpg"}
                                                        alt={event.eventName} 
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80";
                                                        }}
                                                    />
                                                    <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1 m-2 rounded">
                                                        Approved
                                                    </div>
                                                </div>
                                                <div className="p-5 flex-grow">
                                                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                                                        {event.eventName}
                                                    </h3>
                                                    
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex items-center text-gray-600">
                                                            <MdDateRange className="text-blue-500 mr-2" />
                                                            <span>{formatDate(event.eventDate)}</span>
                                                        </div>
                                                        <div className="flex items-center text-gray-600">
                                                            <MdAccessTime className="text-blue-500 mr-2" />
                                                            <span>{event.eventStartTime} - {event.eventFinishTime}</span>
                                                        </div>
                                                        {event.eventType && (
                                                            <div className="flex items-center text-gray-600">
                                                                <MdCategory className="text-blue-500 mr-2" />
                                                                <span>{event.eventType}</span>
                                                            </div>
                                                        )}
                                                        {event.eventVenue && (
                                                            <div className="flex items-center text-gray-600">
                                                                <MdLocationOn className="text-blue-500 mr-2" />
                                                                <span className="line-clamp-1">{event.eventVenue}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="px-5 py-3 bg-gray-50 flex justify-end">
                                                    <span className="text-blue-600 font-medium text-sm">View Details →</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center mt-12">
                                        <nav className="bg-white px-4 py-3 rounded-lg shadow-md flex items-center">
                                            <button
                                                onClick={() => paginate(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={`p-2 rounded-full mr-2 ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
                                                aria-label="Previous page"
                                            >
                                                <MdKeyboardArrowLeft className="h-6 w-6" />
                                            </button>
                                            
                                            <div className="flex space-x-1">
                                                {Array.from({ length: totalPages }, (_, i) => {
                                                    const pageNumber = i + 1;
                                                    // Show current page, first and last pages, and one page on either side of current
                                                    const showPage = pageNumber === 1 || 
                                                                    pageNumber === totalPages || 
                                                                    Math.abs(pageNumber - currentPage) <= 1;
                                                    
                                                    // Show dots for page breaks
                                                    if (!showPage) {
                                                        // Only show one set of dots on each side
                                                        if ((pageNumber === 2 && currentPage > 3) || 
                                                            (pageNumber === totalPages - 1 && currentPage < totalPages - 2)) {
                                                            return (
                                                                <span key={pageNumber} className="px-3 py-1 text-gray-500">
                                                                    ...
                                                                </span>
                                                            );
                                                        }
                                                        return null;
                                                    }
                                                    
                                                    return (
                                                        <button
                                                            key={pageNumber}
                                                            onClick={() => paginate(pageNumber)}
                                                            className={`w-10 h-10 rounded-full ${
                                                                currentPage === pageNumber
                                                                ? 'bg-blue-600 text-white font-bold'
                                                                : 'text-blue-600 hover:bg-blue-100'
                                                            }`}
                                                        >
                                                            {pageNumber}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            
                                            <button
                                                onClick={() => paginate(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={`p-2 rounded-full ml-2 ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
                                                aria-label="Next page"
                                            >
                                                <MdKeyboardArrowRight className="h-6 w-6" />
                                            </button>
                                        </nav>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="mt-20">
                <Footer />
            </div>
        </div>
    );
};

export default EventView;