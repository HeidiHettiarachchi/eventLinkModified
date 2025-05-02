import React, { useEffect, useState } from 'react';
import './SideBarStaff.css';
import logo from '/assets/logo.png';
import { useNavigate } from 'react-router-dom';
import Profile from '../../views/Profile/Profile';
import CalendarStaff from '../../views/Calendar/CalendarStaff';
import StaffManageEvents from '../../views/StaffAdvisor/StaffManageEvents';
import StaffManageOrganization from '../../views/StaffAdvisor/StaffManageOrganisation';
import { getUsersAPI } from '../../services/UserService';
import {getUserDetailsAPI} from '../../services/AuthService';




const SideBarStaff: React.FC = () => {
    const navigate = useNavigate();
    const [isBouncing, setIsBouncing] = React.useState(true);
    // const [username, setUserName] = React.useState<string>('');
     const [userDetails, setUserDetails] = useState<IUser | null>(null);
        const [loading, setLoading] = useState<boolean>(true);
        const [error, setError] = useState<string | null>(null);
        const [username, setUserName] = React.useState<string>('');
        const [email, setEmail] = React.useState<string>('');
        const [role, setRole] = React.useState<string>('');
        const [userId, setUserId] = React.useState<string>('');

    useEffect(() => {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setIsBouncing(false), 3500);
        return () => clearTimeout(timer);
    }, []);

    const handleLogout = () => {
        navigate('/');
    };

 
      useEffect(() => {
 
         // Fetch user details when the component mounts
         fetchUserDetails();
       }
       , []);
 
     const fetchUserDetails = async () => {
         try {
           // Get current user's details (including email)
           const currentUser = await getUserDetailsAPI();
     
           if (!currentUser.data.username ) {
             console.error("Failed to get current user details or email");
             setLoading(false);
             return;
           }
     
           // Get all users
           const allUsers = await getUsersAPI();
     
           // Find the user with matching email
           const matchedUser = allUsers.find(
             (user) => user.email === currentUser.data.email
           );
     
           if (matchedUser) {
             // Set the full user details including ID and any other properties
             setUserDetails(matchedUser);
             setUserName(matchedUser.username);
             console.log("User details matched and set:", matchedUser);
           } else {
             console.error(
               "No matching user found with email:",
               currentUser.data.email
             );
             // Set error state and stop loading
             setError("User not found in the system");
             setLoading(false);
           }
         } catch (error) {
           console.error("Failed to fetch user details", error);
           setError("Failed to load user information");
           setLoading(false);
         }
       };
     
 
 
    const navItems = [
        {
            label: 'Profile',
            href: '/staff/profile',
            component: <Profile />,
            iconPath:
                'M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
        },
        {
            label: 'Events',
            href: '/staff/eventsAdmin',
            component: <StaffManageEvents />,
            iconPath:
                'M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z',
        },
        {
            label: 'Organizations',
            href: '/staff/organizations',
            component: <StaffManageOrganization />,
            iconPath:
                'M17 20h5v-2a3 3 0 00-5.356-1.857M9 20h6m-6 0v-2a3 3 0 016 0v2M9 20H4v-2a3 3 0 015.356-1.857M15 10a3 3 0 11-6 0 3 3 0 0 1 6 0z',
        },
        {
            label: 'Calendar',
            href: '/staff/calendar',
            component: <CalendarStaff />,
            iconPath:
                'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5',
        },
      
    ];

    return (
        <div className="relative bg-gradient-to-r min-h-screen flex font-poppins">
            {/* Background Animation */}
            <div className="areaSBstaf">
                <ul className="circlesSBstaff">
                    {[...Array(10)].map((_, index) => (
                        <li key={index} className="circle-staff-li"></li>
                    ))}
                </ul>
            </div>

            <aside className="fixed top-0 left-0 z-50 bg-[#f45a01] w-64 h-full flex flex-col">
                <div className="p-4 flex items-center justify-start border-b border-orange-200 dark:border-orange-700">
                    <div className="flex items-center space-x-3">
                        <img src={logo} alt="Logo" className="h-10 w-auto" />
                        <span className="text-white text-xl font-semibold">Dashboard</span>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto">
                    <ul className="p-4 space-y-2">
                        {navItems.map((item, idx) => (
                            <li
                                className="animate-fade-in"
                                key={item.label}
                                style={{
                                    animationDelay: `${(idx + 1) * 0.1}s`,
                                    animationFillMode: 'forwards',
                                }}
                            >
                                <a
                                    href={item.href}
                                    className="flex items-center p-2 text-gray-700 dark:text-white rounded-lg hover:bg-[#069efd] transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.iconPath} />
                                    </svg>
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4 border-t border-orange-200 dark:border-orange-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center text-gray-700 dark:text-white hover:text-[#FC8239] transition cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-h-screen bg-white ml-64">
                <header>
                    <div className="fixed top-0 left-64 right-0 z-40 flex items-center justify-between px-6 py-4 bg-[#FC8239] backdrop-blur-md shadow-md h-18.5">
                        <span className="text-2xl font-semibold font-poppins text-white px-2">Event Link</span>
                        <div className="flex items-center space-x-6">
                            <span className={`text-lg font-semibold font-poppins text-white ${isBouncing ? 'animate-bounce' : ''}`}>
                                Hi, {username} <span>😊</span>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center text-white hover:text-black transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </header>
            </div>
        </div>
    );
};

export default SideBarStaff;
