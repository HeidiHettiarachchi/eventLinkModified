import React, { useEffect, useState } from 'react';
import Calendar, { TileClassNameFunc } from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import SideBarStaff from '../../components/SideBar/SideBarStaff';
import {getApprovedEvents} from '../../../../backend/controllers/eventController';

// Define the type for the event data
interface Event {
    eventDate: string; // Adjust this type based on your actual event data structure
}

const CalendarStaff: React.FC = () => {
    const [blockedDates, setBlockedDates] = useState<Date[]>([]);

    useEffect(() => {
        const fetchApprovedEvents = async () => {
            try {
                const response = await axios.get<Event[]>('/events/approved'); // Adjust the URL as necessary
                const dates = response.data.map(event => new Date(event.eventDate));
                setBlockedDates(dates);
            } catch (error) {
                console.error('Error fetching approved events:', error);
            }
        };

        fetchApprovedEvents();
    }, []);

    // Define the tileClassName function with the appropriate type
    const tileClassName: TileClassName = ({ date }) => {
        if (blockedDates.some(blockedDate => blockedDate.toDateString() === date.toDateString())) {
            return 'blocked-date'; // Add a class to style blocked dates
        }
        return null;
    };

    return (
        <div>
            <h1>Event Calendar</h1>
            <Calendar
                tileClassName={tileClassName}
                // You can add more props here as needed
            />
        </div>
    );
};

export default CalendarStaff;