import { FiCalendar, FiClock, FiUser, FiFileText, FiX, FiDollarSign, FiImage } from "react-icons/fi";
import { MdOutlineEventNote, MdModeOfTravel, MdCategory, MdLocationOn } from "react-icons/md";
import { IEvent } from "../../types/IResponse";
import Button from "../Button/Button";
import { getFileUrl } from "../../services/FileUploadService";

interface ViewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: IEvent | null;
}

const ViewEventModal = ({ isOpen, onClose, event }: ViewEventModalProps) => {
  if (!isOpen || !event) return null;

  const proposalUrl = event.eventProposal ? getFileUrl(event.eventProposal) : "";
  const formUrl = event.eventForm ? getFileUrl(event.eventForm) : "";
  
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
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200 transition-all duration-300">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold flex items-center text-gray-800">
            <MdOutlineEventNote className="mr-2 text-blue-600" />
            {event.eventName}
          </h2>
          <Button 
            text="Close" 
            color="secondary" 
            size="sm"
            onClick={onClose} 
            icon={<FiX />}
            className="hover:bg-gray-200 transition-colors" 
          />
        </div>

        {/* Status badge */}
        <div className="mb-6">
          <span className={`px-4 py-1.5 rounded-full text-sm font-medium inline-flex items-center ${
            event.eventStatus === "Approved"
              ? "bg-green-100 text-green-800 ring-1 ring-green-200"
              : event.eventStatus === "Rejected"
              ? "bg-red-100 text-red-800 ring-1 ring-red-200"
              : "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200"
          }`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${
              event.eventStatus === "Approved" 
                ? "bg-green-500" 
                : event.eventStatus === "Rejected" 
                ? "bg-red-500" 
                : "bg-yellow-500"
            }`}></span>
            {event.eventStatus}
          </span>
        </div>

        {/* Event Image - added new section */}
        {event.eventImage && (
          <div className="mb-6 rounded-xl overflow-hidden shadow-md">
            <div className="relative">
              <img 
                src={event.eventImage} 
                alt={`${event.eventName} banner`} 
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <div className="flex items-center text-white">
                  <FiImage className="mr-2" />
                  <span className="font-medium">Event Banner</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-4 text-blue-700 flex items-center">
              <FiCalendar className="mr-2" />
              Event Details
            </h3>
            
            <div className="space-y-4">
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Date</p>
                <p className="font-medium">{formatDate(event.eventDate)}</p>
              </div>
              
              <div className="flex space-x-4">
                <div className="bg-white p-3 rounded-md shadow-sm flex-1">
                  <p className="text-sm text-gray-600 mb-1">Start Time</p>
                  <p className="font-medium">{event.eventStartTime}</p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm flex-1">
                  <p className="text-sm text-gray-600 mb-1">End Time</p>
                  <p className="font-medium">{event.eventFinishTime}</p>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Duration</p>
                <p className="font-medium">{event.timePeriod}</p>
              </div>
              
              {/* Event Venue */}
              {event.eventVenue && (
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <p className="text-sm text-gray-600 flex items-center mb-1">
                    <MdLocationOn className="mr-1 text-red-500" />
                    Venue
                  </p>
                  <p className="font-medium">{event.eventVenue}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-4 text-blue-700 flex items-center">
              <MdCategory className="mr-2" />
              Event Type & Organization
            </h3>
            
            <div className="space-y-4">
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Category</p>
                <p className="font-medium">{event.eventType}</p>
              </div>
              
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-sm text-gray-600 mb-1 flex items-center">
                  <MdModeOfTravel className="mr-1 text-blue-600" />
                  Mode
                </p>
                <p className="font-medium">{event.eventMode}</p>
              </div>
              
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-sm text-gray-600 mb-1 flex items-center">
                  <FiUser className="mr-1 text-blue-600" />
                  President
                </p>
                <p className="font-medium">{event.eventPresident}</p>
              </div>

             
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-sm text-gray-600 mb-1 flex items-center">
                  <FiDollarSign className="mr-1 text-blue-600" />
                  Budget
                </p>
                <p className="font-medium">Rs. {event.eventBudget}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Documents section */}
        <div className="mb-8">
          <h3 className="font-bold text-lg mb-4 text-blue-700 flex items-center border-b pb-2">
            <FiFileText className="mr-2" />
            Event Documents
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href={proposalUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors shadow-sm hover:shadow-md group"
            >
              <div className="bg-blue-100 p-3 rounded-lg mr-4 group-hover:bg-blue-200 transition-colors">
                <FiFileText className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Event Proposal</p>
                <p className="text-sm text-gray-600">View PDF document</p>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-blue-600 text-sm">Open →</span>
              </div>
            </a>
            
            <a 
              href={formUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors shadow-sm hover:shadow-md group"
            >
              <div className="bg-blue-100 p-3 rounded-lg mr-4 group-hover:bg-blue-200 transition-colors">
                <FiFileText className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Event Form</p>
                <p className="text-sm text-gray-600">View PDF document</p>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-blue-600 text-sm">Open →</span>
              </div>
            </a>
          </div>
        </div>
        
        {/* Creation details */}
        <div className="text-sm text-gray-600 border-t pt-4 mt-2 flex flex-wrap justify-between">
          <p className="px-3 py-1 bg-gray-100 rounded-full mb-2">
            Created: {new Date(event.createdAt).toLocaleString()}
          </p>
          {event.updatedAt && event.updatedAt !== event.createdAt && (
            <p className="px-3 py-1 bg-gray-100 rounded-full mb-2">
              Last updated: {new Date(event.updatedAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewEventModal;